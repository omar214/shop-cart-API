const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true
    },
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId, ref: "Product"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }],
        required: true
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;