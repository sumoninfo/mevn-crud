const db = require("../models");
const Category = db.category;
const handleError = (res, statusCode, message) => {
    res.status(statusCode).json({status: false, message});
};

exports.index = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json({status: true, message: 'Categories Fetched!', data: categories});
    } catch (err) {
        console.error(err);
        handleError(res, 500, 'Internal server error');
    }
};

exports.store = async (req, res) => {
    const data = req.body;
    const model = new Category(data);

    try {
        const category = await model.save();
        res.status(200).json({status: true, message: 'Category Created!', data: category});
    } catch (err) {
        console.error(err);
        handleError(res, 500, 'Internal server error');
    }
};

exports.show = async (req, res) => {
    const id = req.params.id;

    try {
        const category = await Category.findById(id);
        if (!category) {
            handleError(res, 404, 'Category not found');
            return;
        }

        res.status(200).json({status: true, message: 'Category Found!', data: category});
    } catch (err) {
        console.error(err);
        handleError(res, 500, 'Internal server error');
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const category = await Category.findByIdAndUpdate(id, data, {new: true, runValidators: true});

        if (!category) {
            handleError(res, 404, 'Category not found');
            return;
        }

        res.status(200).json({status: true, message: 'Category updated', data: category});
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({status: false, message: 'Validation error', errors: err.errors});
        } else {
            console.error(err);
            handleError(res, 500, 'Internal server error');
        }
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            handleError(res, 404, 'Category not found');
            return;
        }

        res.status(200).json({status: true, message: 'Category deleted'});
    } catch (err) {
        console.error(err);
        handleError(res, 500, 'Internal server error');
    }
};
