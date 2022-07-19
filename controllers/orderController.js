const mongoose = require('mongoose');
const Order = require('../models/orderModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')

// TODO do population
module.exports.orders_get_all = async (req, res) => {
    try {
        const orders = await Order.
            find()
            .select('owner products')
            .populate({
                path: "owner",
                model: "User",
                select: "email"
            })
            .populate({
                path: 'products',
                populate: {
                    path: 'product',
                    model: 'Product'
                }
            });
        console.log(orders[0].products);
        res.status(200).json({
            count: orders.length,
            orders: orders
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "error getting data" })
    }

}

module.exports.orders_get_order = async (req, res) => {
    const _id = req.params._id;
    if (!_id)
        res.status(500).json({ error: "id is required" });
    try {
        const order = await Order
            .findById(_id)
            .select('owner products')
            .populate('owner')
            .populate({
                path: 'products.product',
                model: 'Product'
            });
        res.status(200).json({ ...order._doc })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "error getting data" })
    }
}

module.exports.orders_create_order = async (req, res) => {
    let { owner, products } = req.body;
    if (!owner || !products)
        return res.status(500).json({ message: "valid owner & products are required" });

    if (!mongoose.isValidObjectId(owner))
        return res.status(500).json({ message: "invalid owner" });

    // valid owner
    if (! await User.findById(owner))
        return res.status(500).json({ message: "owner is not found" });

    // loop valid products
    for (const p of products) {
        if (!mongoose.isValidObjectId(p.id))
            return res.status(500).json({ message: `invalid product id ${id}` });

        if (! await Product.findById(p.id))
            return res.status(500).json({ message: `id ${id} is not found` })

        if (p?.quantity < 0)
            p.quantity = 1;
    }


    let order = { owner, products };
    try {
        order = new Order(order);
        order.save();
        res.status(200).json({ message: "order added", order })
    } catch (error) {
        res.status(500).json({ message: "error adding user" })
    }
}

module.exports.orders_edit_order = async (req, res) => {
    const _id = req.params._id;
    if (!_id)
        res.status(500).json({ error: "id is required" });

    let editedOrder = req.body;
    if (!editedOrder.owner && !editedOrder.products)
        res.status(500).json({ error: "missing values to edit" });

    // TODO add validation for owner& product values
    console.log('before');
    try {
        const orderFromDb = await Order.findById(_id);
        console.log('old', orderFromDb)
        for (const key in editedOrder) {
            if (!Order.schema.path(key)) {
                console.log('invalid field');
                return res.status(500).json({ msg: "invalid field" });
            }
            orderFromDb[key] = editedOrder[key];
        }
        editedOrder = await orderFromDb.save();
        res.status(200).json({ msg: "editedOrder edit done", editedOrder });
    } catch (error) {
        console.log('error editing');
        res.status(500).json({ message: "error editing ", error })
    }
}

module.exports.orders_delete_order = async (req, res) => {
    const _id = req.params._id;
    if (!_id)
        return res.status(500).json({ error: "id is required" });

    try {
        const order = await Order.findById(_id);
        if (!order) {
            console.log('not found');
            return res.status(500).json({ message: "order not found" })
        }
        const deleted = await Order.deleteOne({ _id });
        res.status(200).json({ message: "order deleted successfully" });
    } catch (error) {
        res.status(500).json({ error })
    }
}