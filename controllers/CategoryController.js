const Category = require(__dirname + "../models/Category");

const CategoryController =  {
	async create_category(req, res) {
		const {categories} = req.body;
		
		try {
			const category_ids = await Category.save(categories);

			res.status(200).json({
				"type": "success",
				"msg": "save categor(ies) successful",
				"data": category_ids
			});
		}catch(err) {
			res.status(500).json({
				"type": "error",
				"msg": "create categories failed",
				"data": err.message
			});
		}
	}
}

module.exports = CategoryController;