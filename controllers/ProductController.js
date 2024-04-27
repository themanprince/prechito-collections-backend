const Product = require(__dirname + '/../models/Product');
const respondError = require(__dirname + "/../helpers/respondError");

const ProductController = {
    
    /* get all products */
    async get_products(req, res) {

        const qPg = req.query.pg || 1;
        const qCategory = req.query.category;

        try {

            let products;

            if (qCategory)
            	products = await Product.getPageByCategoryName(qPg, qCategory);
            else
                products = await Product.getPage(qPg);
            
            res.status(200).json({
                type: "success",
                products
            })
        } catch (err) {
            respondError(res, err);
        }
    },

    /* get single product */
    async get_product(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            if(!product) {
                res.status(404).json({
                    type: "error",
                    message: "Product doesn't exists"
                })
            } else{
                res.status(200).json({
                    type: "success",
                    product
                })
            }   
        } catch (err) {
           respondError(res, err);
        }
    },

    /* create new product */
    async create_product(req, res) {
        const newProduct = new Product(req.body);
        try {
            const savedProduct = await newProduct.save();
            res.status(201).json({
                type: "success",
                message: "Product created successfully",
                savedProduct
            })
        } catch (err) {
            respondError(res, err);
        }
    },

    /* update product */
    async update_product(req, res) {
        const existing = await Product.findById(req.params.id);
        if(!existing){
            res.status(404).json({
                type: "error",
                message: "Product doesn't exists"
            })
        } else {
            try {
                const updatedProduct = await Product./*findByIdAndUpdate*/updateAndReturn(req.params.id, req.body);
                res.status(200).json({
                    type: "success",
                    message: "Product updated successfully",
                    updatedProduct
                })
            } catch (err) {
                respondError(res, err);
            }
        }
    },

    /* delete product */
    async delete_product(req, res) {
        const existing = await Product.findById(req.params.id);
        if (!existing) {
            res.status(200).json({
                type: "error",
                message: "Product doesn't exists"
            })
        } else {
            try {
                await Product.findOneAndDelete(req.params.id);
                res.status(200).json({
                    type: "success",
                    message: "Product has been deleted successfully"
                });
            } catch (err) {
            	respondError(res, err);
            }
        }
    }
};

module.exports = ProductController;