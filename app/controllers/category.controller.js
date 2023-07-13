const db = require("../models");
const Category = db.category;
const handleError = (res, statusCode, message) => {
    res.status(statusCode).json({status: false, message});
};

exports.index = async (req, res) => {
    const reqPage = parseInt(req.query.page) || 1;  // Current page number
    const pageSize = parseInt(req.query.per_page) || 10;  // Number of items per page
    const searchTerm = req.query.search || '';  // Number of items per page

    const query = {
        title: {
            $regex: searchTerm,
            $options: 'i'
        }
    };

    const options = {
        page: reqPage,
        limit: pageSize,
        sort: {title: -1} // Sort by the 'title' column in descending order
    };

    try {
        const pipeline = [
            {$match: query},
            {
                $lookup: {
                    from: 'categoryposts',
                    localField: '_id',
                    foreignField: 'categoryId',
                    as: 'posts'
                }
            },
            {
                $addFields: {
                    postCount: {$size: '$posts'}
                }
            },
            {
                $sort: options.sort
            },
            {
                $skip: (options.page - 1) * options.limit
            },
            {
                $limit: options.limit
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    status: 1,
                    postCount: 1
                }
            }
        ];

        const [updatedDocs, [{count}]] = await Promise.all([
            Category.aggregate(pipeline),
            Category.aggregate([
                {$match: query},
                {$count: 'count'}
            ])
        ]);

        const total = count || 0;
        const pages = Math.ceil(total / options.limit);

        const paginationMeta = {
            from: (options.page - 1) * options.limit + 1,
            to: (options.page - 1) * options.limit + updatedDocs.length,
            current_page: options.page,
            per_page: options.limit,
            total: total,
            last_page: pages
        };

        res.status(200).json({
            status: true,
            message: 'Categories Fetched!',
            data: {
                data: updatedDocs,
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
