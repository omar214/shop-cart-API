const mongoose = require('mongoose');
const Product = require('../models/productModel')

module.exports.products_get_all = async (req, res) => {
    try {
        const select = "name price";
        const products = await Product.find({}, select);
        res.status(200).json({
            count: products.length,
            products: products
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "error getting data" })
    }
}

module.exports.products_get_product = async (req, res) => {
    const _id = req.params._id;
    if (!_id)
        res.status(500).json({ error: "id is required" });
    try {
        const product = await Product.findById(_id, 'name price');
        if (product)
            res.status(200).json(product);
        else
            res.status(404).json({ message: "product not found" });
    } catch (error) {
        res.status(500).json({ error: "cant find this product" });
    }

}

module.exports.products_create_product = async (req, res) => {
    const { name, price } = req.body;
    if (!name || !price)
        res.status(500).send(" name & price are required ");
    const newProduct = new Product({ name: name, price: price });
    try {
        await newProduct.save();
        console.log('product added successfully');
        res.status(200).json({
            msg: "product added successfully",
            newProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("error adding product");
    }
}

module.exports.products_edit_product = async (req, res) => {
    const _id = req.params._id;
    if (!_id)
        res.status(500).json({ error: "id is required" });

    let editedProduct = req.body;
    if (!editedProduct.name && !editedProduct.price)
        res.status(500).json({ error: "missing values to edit" });

    console.log('before');
    try {
        const oldProduct = await Product.findById(_id);
        console.log('old', oldProduct)
        for (const key in editedProduct) {
            if (!Product.schema.path(key)) {
                console.log('invalid field');
                return res.status(500).json({ msg: "invalid field" });
            }
            oldProduct[key] = editedProduct[key];
        }
        editedProduct = await oldProduct.save();
        res.status(200).json({ msg: "editedProduct edit done", editedProduct });
    } catch (error) {
        console.log('error editing');
        res.status(500).json({ message: "error editing ", error })
    }
}

module.exports.products_delete_product = async (req, res) => {
    const _id = req.params._id;
    if (!_id)
        return res.status(500).json({ error: "id is required" });

    try {
        const product = await Product.findById(_id);
        if (!product) {
            console.log('not found');
            return res.status(500).json({ message: "product not found" })
        }
        const deleted = await Product.deleteOne({ _id });
        res.status(200).json({ message: "product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error })
    }
}