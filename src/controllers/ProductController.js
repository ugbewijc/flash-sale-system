/**
 * 
 */
import { randomUUID } from 'node:crypto';
import { matchedData, validationResult } from 'express-validator';
import { io } from '../index.js';
import { Product } from '../models/Products.js';
import { Sales } from '../models/Sales.js';
export default class ProductController {
    constructor() { }

    static async getProduct(req, res) {
        try {
            if (!req.body?.id) {
                throw {
                    code: 400,
                    errors: ['Product ID required']
                }
            }
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(({ msg }) => msg);
                throw {
                    code: 400,
                    errors: errorMessages
                }
            }

            const { id } = matchedData(req, { locations: ['body'] });
            let product;

            if (req.user?.role == 'admin') {
                product = await Product.findOne({ _id: id })
                    .select('-__v -createdAt -updatedAt')
            } else {
                product = await Product.findOne(
                    {
                        _id: id,
                        start_time: { $lte: new Date() },
                        quantity: { $gt: 0 }
                    },
                    {
                        _id: 1,
                        name: 1,
                        description: 1,
                        price: 1,
                        moq: 1,
                    }
                );

                if (product) {
                    product.moq = product.moq > product.quantity ? product.quantity : product.moq;
                }
            }

            if (!product) {
                throw {
                    code: 404,
                    errors: ['Product not found']
                }
            }

            return res.status(200).json({
                success: true,
                data: product
            })
        } catch (e) {
            return res.status(e.code || 500).json({
                success: false,
                errors: e.errors || ['Unable to Find Product']
            });
        }
    }

    static async getAllProducts(req, res) {
        try {
            let products;
            if (req.user?.role == 'admin') {
                products = await Product.find()
                    .select('-__v -createdAt -updatedAt')
                    .sort({ createdAt: -1 });
            } else {
                products = await Product.aggregate([
                    {
                        $match: {
                            start_time: { $lte: new Date()},
                            quantity: { $gt: 0 }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            description: 1,
                            price: 1,
                            moq: {
                                $cond: { if: { $gt: ["$moq", "$quantity"] }, then: "$quantity", else: "$moq" }
                            },
                            start_time: 1
                        }
                    },
                    {
                        $sort: { start_time: -1 },
                    }, {
                        $project: {
                            _id: 1,
                            name: 1,
                            description: 1,
                            price: 1,
                            moq: 1
                        }
                    }
                ]);
            }
            return res.status(200).json({
                success: true,
                data: products
            });
        } catch (e) {
            return res.status(e.code || 500).json({
                success: false,
                errors: e.errors || ['Unable to Find Products']
            });
        }
    }

    static async newProduct(req, res) {
        try {
            const requiredFields = ['name', 'quantity', 'price', 'start_time'];
            const missingFields = requiredFields.filter(field => !req.body[field]);

            if (missingFields.length > 0) {
                throw {
                    code: 400,
                    errors: [`Missing required fields: ${missingFields.join(', ')}`]
                }
            }

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(({ msg }) => msg);
                throw {
                    code: 400,
                    errors: errorMessages
                }
            }

            const productData = matchedData(req, { locations: ['body'] });

            const newProduct = new Product(productData);

            const { name, description, price, moq, id, start_time } = await newProduct.save();

            if (!name) {
                throw {
                    code: 500,
                    errors: ['Unable to save product']
                }
            }

            return res.status(201).json({
                success: true,
                data: {
                    id,
                    name,
                    description,
                    price,
                    moq,
                    start_time
                }
            });
        } catch (e) {
            return res.status(e.code || 500).json({
                success: false,
                errors: e.errors || ['Unable to save product']
            });
        }
    }
    
    static async updateProduct(req, res) {
        try {
            const requiredFields = ['id', 'name', 'quantity', 'price', 'start_time'];
            const missingFields = requiredFields.filter(field => !req.body[field]);

            if (missingFields.length > 0) {
                throw {
                    code: 400,
                    errors: [`Missing required fields: ${missingFields.join(', ')}`]
                };
            }

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(({ msg }) => msg);
                throw {
                    code: 400,
                    errors: errorMessages
                };
            }

            const productData = matchedData(req, { locations: ['body'] });

            const product = await Product.findById(productData.id);
            if (!product) {
                throw {
                    code: 404,
                    errors: ['Product not found']
                };
            }

            productData.sold_quantity = product.sold_quantity;
            productData.quantity = productData.quantity > product.quantity ? productData.quantity : product.quantity;
            const updatedProduct = await Product.updateOne({ _id: productData.id }, productData);
            io.emit('quantityUpdate', { id: productData.id, quantity: productData.quantity }); 

            if (!updatedProduct.modifiedCount) {
                throw {
                    code: 404,
                    errors: ['Unable to update product']
                };
            }

            return res.status(200).json({
                success: true,
                data: productData
            });
        } catch (e) {
            return res.status(e.code || 500).json({
                success: false,
                errors: e.errors || ['Unable to update product'],
            });
        }
    }

    static async salesCart(req, res) {
        try {
            const missingFields = ['cart'].filter(field => !req.body[field]);

            if (missingFields.length > 0) {
                throw {
                    code: 400,
                    errors: [`Missing required fields: ${missingFields.join(', ')}`]
                };
            }

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(({ msg }) => msg);
                throw {
                    code: 400,
                    errors: errorMessages
                };
            }
            const cartDetails = {
                customerId: req.user._id,
                transactionId: randomUUID(),
                cart: matchedData(req, { locations: ['body'] }).cart
            };

            const sales = await Sales.newSales(cartDetails);

            return res.status(201).json({
                success: true,
                data: sales
            });
        } catch (e) {
            return res.status(e.code || 500).json({
                success: false,
                errors: e.errors || ['Unable to get product']
            });
        }
    }
}