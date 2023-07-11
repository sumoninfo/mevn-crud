const db = require("../models");
const Author = db.author;
const handleError = (res, statusCode, message) => {
    res.status(statusCode).json({status: false, message});
};

exports.index = async (req, res) => {
    const reqPage = parseInt(req.query.page) || 1;  // Current page number
    const pageSize = parseInt(req.query.per_page) || 10;  // Number of items per page

    try {
        const result = await Author.paginate({}, {page: reqPage, limit: pageSize});
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
            status: true, message: 'Authors Fetched!', data: {
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
    const model = new Author(data);

    try {
        const author = await model.save();
        res.status(200).json({status: true, message: 'Author Created!', data: author});
    } catch (err) {
        console.error(err);
        handleError(res, 500, err);
    }
};

exports.show = async (req, res) => {
    const id = req.params.id;

    try {
        const author = await Author.findById(id);
        if (!author) {
            handleError(res, 404, 'Author not found');
            return;
        }

        res.status(200).json({status: true, message: 'Author Found!', data: author});
    } catch (err) {
        console.error(err);
        handleError(res, 500, err);
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const author = await Author.findByIdAndUpdate(id, data, {new: true, runValidators: true});

        if (!author) {
            handleError(res, 404, 'Author not found');
            return;
        }

        res.status(200).json({status: true, message: 'Author updated', data: author});
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
        const author = await Author.findByIdAndDelete(id);

        if (!author) {
            handleError(res, 404, 'Author not found');
            return;
        }

        res.status(200).json({status: true, message: 'Author deleted'});
    } catch (err) {
        console.error(err);
        handleError(res, 500, err);
    }
};
