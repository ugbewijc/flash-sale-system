/**
 * 
 */
import mongoose from 'mongoose';
import {Product} from './Products.js';

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
    Sales.insertMany(updatedRecords.recordedProduct);
    return updatedRecords
  } catch (error) {
    throw new Error(error);     
  }
};

export const Sales = mongoose.model('Sale', salesSchema);
