/**
 * 
 */
import mongoose from 'mongoose';
import { Product } from './Products.js';

const salesSchema = new mongoose.Schema({
  transaction_id: { type: String, required: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  // price_per_unit: { type: Number, required: true },
  // total_price: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

// salesSchema.pre('save', function (next) {
//   this.total_price = this.quantity * this.price_per_unit;
//   next();
// });

salesSchema.statics.newSales = async function (salesDetails) {
  try {
    const updatedRecords = {
      purchasedProduct: [],
      lessStockProduct: []
    };
    for (const items of salesDetails.cart) {
      const updatedProduct = await Product.updateOne({
        start_time: { $lte: new Date() },
        _id: items.product_id,
        quantity: { $gte: items.quantity },
        moq: { $gte: items.quantity }
      }, {
        $inc: { quantity: -items.quantity, sold_quantity: items.quantity },
      });
      if (updatedProduct.modifiedCount > 0) {
        items.customer_id = salesDetails.customerId;
        items.transaction_id = salesDetails.transactionId;
        updatedRecords.purchasedProduct.push(items);
      } else {
        updatedRecords.lessStockProduct.push(items);
      }
    }
    await Sales.insertMany(updatedRecords.purchasedProduct);
    return updatedRecords
  } catch (error) {
    throw new Error(error);
  }
};

salesSchema.statics.getLeaderboard = async function ( timestamp,customer_id = { $ne: null }, product_id = { $ne: null }) {
  
  if(typeof customer_id == 'string'){
    customer_id = { $eq: new mongoose.Types.ObjectId(`${customer_id}`) }
  }
  
  if(typeof product_id == 'string'){
    product_id = { $eq: new mongoose.Types.ObjectId(`${product_id}`) }
  }
  
  return await Sales.aggregate([
    {
      $match: {
        product_id,
        customer_id,
        timestamp
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'customer_id',
        foreignField: '_id',
        as: 'customer'
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: 'product_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    {
      $unwind: '$customer'
    },
    {
      $unwind: '$product'
    },
    {
      $project: {
        _id: 1,
        transaction_id: 1,
        customer_id: 1,
        customer_name: '$customer.name',
        product_id: 1,
        product_name: '$product.name',
        quantity: 1,
        timestamp: 1
      }
    }, {
      $sort: { timestamp: -1 }
    }
  ]);
}

export const Sales = mongoose.model('Sale', salesSchema);
