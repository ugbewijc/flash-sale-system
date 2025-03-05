/**
 * 
 */
import { matchedData, validationResult } from 'express-validator';
import { body } from 'express-validator';
import Product from '../models/ProductSchema.js';
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
            const product = await Product.findOne({ _id: id })
                .select('-__v -createdAt -updatedAt')

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
            const products = await Product.find()
                .select('-__v -createdAt -updatedAt')
                .sort({ createdAt: -1 });

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

            const { name, price, moq, id } = await newProduct.save();

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
                    price,
                    moq
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

            const product = await Product.findById(productData.id);
            if (!product) {
                throw {
                    code: 404,
                    errors: ['Product not found']
                }
            }

            const validStatusTransitions = {
                //old status: new allowed status
                pending: ['paused'],
                active: ['paused'],
                pause: ['active']
            };

            const allowedTransitions = validStatusTransitions[product.status] || [];
            if (!allowedTransitions.includes(productData.status) && product.status !== productData.status) {
                throw {
                    status: 400,
                    errors: [`Invalid status transition from ${product.status} to ${productData.status}`]

                }
            }

            const updatedProduct = await Product.findOneAndUpdate({ _id: productData.id }, productData, { new: true })
                .select('-__v -createdAt -updatedAt')
            if (!updatedProduct) {
                throw {
                    code: 404,
                    errors: ['Unable to update product']
                }
            }

            return res.status(200).json({
                success: true,
                data: updatedProduct
            });
        } catch (e) {
            console.log(e);
            return res.status(e.code || 500).json({
                success: false,
                errors: e.errors || ['Unable to update product'],
                // details: e
            });
        }
    }
}