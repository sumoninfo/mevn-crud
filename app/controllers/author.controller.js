const db = require("../models");
const Author = db.author;
const handleError = (res, statusCode, message) => {
    res.status(statusCode).json({status: false, message});
};

exports.index = async (req, res) => {
    try {
        const categories = await Author.find({});
        res.status(200).json({status: true, message: 'Authors Fetched!', data: categories});
    } catch (err) {
        console.error(err);
        handleError(res, 500, 'Internal server error');
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
        handleError(res, 500, 'Internal server error');
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
        handleError(res, 500, 'Internal server error');
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
            handleError(res, 500, 'Internal server error');
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
        handleError(res, 500, 'Internal server error');
    }
};
