import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Product price must be greater than 0']
    },
    quantity: {
        type: Number,
        required: [true, 'Available Product quantity is required'],
        min: [0, 'Available Product quantity must be greater than 0'],
        max: [200, 'Available Product quantity must be less than 200']
    },
    sold_quantity: {
        type: Number,
        default: 0
    },
    moq: {
        type: Number,
        required: false,
        default: 5,
        min: [0, 'Product Minimum Order Quantity must be greater than 0'],
        max: [200, 'Product Minimum Order Quantity must be less than 200']
    },
    start_time: {
        type: Date,
        required: [true, 'Start time is required'],
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'paused', 'sold out', 'closed'],
        default: 'pending'
    }

}, { timestamps: true });

ProductSchema.pre('save', async function (next) {
    if (this.start_time < Date.now()) {
        this.status = 'active';
    }
    next();
});


ProductSchema.updateProduct = async function (productData) {
    try {
        throw new Error('saw error here')
    } catch (error) {
        console.log(error);
        return "saw error"
    }
    // const validStatusTransitions = {
    //   pending: ['pause'],
    //   active: ['pause'],
    //   pause: ['active']
    // };
  
    const product = await this.findById(productData.id);
    return product;
    // if (!product) throw new Error('Product not found');
  
    // const allowedTransitions = validStatusTransitions[product.status] || [];
    // if (!allowedTransitions.includes(newStatus) && product.status !== productData.status) {
    //   throw new Error(`Invalid status transition from ${product.status} to ${newStatus}`);
    // }
  
    // const updatedProduct = await this.findOneAndUpdate(
    //   { _id: productId },
    //   { status: newStatus },
    //   { new: true }
    // );
  
    // return updatedProduct;
    // return findOneAndUpdate({ _id: productData.id }, productData, { new: true })
    //     .select('-__v -createdAt -updatedAt')
  };

const Product = mongoose.model('Product', ProductSchema);
export default Product;

