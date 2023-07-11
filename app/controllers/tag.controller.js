const db = require("../models");
const Tag = db.tag;
const handleError = (res, statusCode, message) => {
    res.status(statusCode).json({status: false, message});
};

exports.index = async (req, res) => {
    const reqPage = parseInt(req.query.page) || 1;  // Current page number
    const pageSize = parseInt(req.query.per_page) || 10;  // Number of items per page

    try {
        const result = await Tag.paginate({}, {page: reqPage, limit: pageSize});
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
            status: true, message: 'Tags Fetched!', data: {
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
