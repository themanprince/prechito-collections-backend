const Category = require(__dirname + "/../models/Category");
const respondError = require(__dirname + "/../helpers/respondError");

const CategoryController =  {
	async create_category(req, res) {
		const {categories} = req.body;
		categoriesArray = categories.split(/,\s+/);
		
		try {
			const category_ids = await Category.save(categoriesArray);
			
			res.status(200).json({
				"type": "success",
				"msg": "save categor(ies) successful",
				"data": category_ids
			});
		} catch(err) {
			respondError(res, err);
		}
	}
}

module.exports = CategoryController;
