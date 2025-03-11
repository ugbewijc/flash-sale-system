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
    }

}, { timestamps: true });

ProductSchema.pre('save', async function (next) {
    if (this.start_time < Date.now()) {
        this.status = 'active';
    }
    next();
});

export const Product = mongoose.model('Product', ProductSchema);

