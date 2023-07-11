const db = require("../models");
const Category = db.category;
const handleError = (res, statusCode, message) => {
    res.status(statusCode).json({status: false, message});
};

exports.index = async (req, res) => {
    const reqPage = parseInt(req.query.page) || 1;  // Current page number
    const pageSize = parseInt(req.query.per_page) || 10;  // Number of items per page

    try {
        const result = await Category.paginate({}, {page: reqPage, limit: pageSize});
        const {docs, total, limit, page, pages} = result;
        // Prepare the meta keys
        const paginationMeta = {
            from: (page - 1) * limit + 1,
            to: (page - 1) * limit + docs.length,
            current_page: page,
            per_page: limit,
            total: total,
            last_page: pages
        };

        res.status(200).json({
            status: true, message: 'Categories Fetched!', data: {
                data: docs,
                meta: paginationMeta
            }
        });
    } catch (err) {
        console.error(err);
        handleError(res, 500, err);
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
        handleError(res, 500, err);
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
        handleError(res, 500, err);
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
            handleError(res, 500, err);
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
        handleError(res, 500, err);
    }
};
