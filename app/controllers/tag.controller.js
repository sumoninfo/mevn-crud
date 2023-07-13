const db = require("../models");
const Tag = db.tag;
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
            { $match: query },
            {
                $lookup: {
                    from: 'tagposts',
                    localField: '_id',
                    foreignField: 'tagId',
                    as: 'posts'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$title' },
                    status: { $first: '$status' },
                    postCount: { $sum: { $size: '$posts' } }
                }
            },
            { $sort: options.sort },
            { $skip: (options.page - 1) * options.limit },
            { $limit: options.limit },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    status: 1,
                    postCount: 1
                }
            }
        ];

        const [updatedDocs, countResult] = await Promise.all([
            Tag.aggregate(pipeline),
            Tag.aggregate([
                {$match: query},
                {$group: {_id: null, count: {$sum: 1}}}
            ])
        ]);

        const count = countResult.length > 0 ? countResult[0].count : 0;
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
            message: 'Tags Fetched!',
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
    const model = new Tag(data);

    try {
        const tag = await model.save();
        res.status(200).json({status: true, message: 'Tag Created!', data: tag});
    } catch (err) {
        console.error(err);
        handleError(res, 500, err);
    }
};

exports.show = async (req, res) => {
    const id = req.params.id;

    try {
        const tag = await Tag.findById(id);
        if (!tag) {
            handleError(res, 404, 'Tag not found');
            return;
        }

        res.status(200).json({status: true, message: 'Tag Found!', data: tag});
    } catch (err) {
        console.error(err);
        handleError(res, 500, err);
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const tag = await Tag.findByIdAndUpdate(id, data, {new: true, runValidators: true});

        if (!tag) {
            handleError(res, 404, 'Tag not found');
            return;
        }

        res.status(200).json({status: true, message: 'Tag updated', data: tag});
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
        const tag = await Tag.findByIdAndDelete(id);

        if (!tag) {
            handleError(res, 404, 'Tag not found');
            return;
        }

        res.status(200).json({status: true, message: 'Tag deleted'});
    } catch (err) {
        console.error(err);
        handleError(res, 500, err);
    }
};
