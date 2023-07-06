const Post = require('../models/Post');

const handleError = (res, statusCode, message) => {
    res.status(statusCode).json({ status: false, message });
};

exports.index = async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({ status: true, message: 'Posts Fetched!', data: posts });
    } catch (err) {
        console.error(err);
        handleError(res, 500, 'Internal server error');
    }
};

exports.store = async (req, res) => {
    const data = req.body;
    const model = new Post(data);

    try {
        const post = await model.save();
        res.status(200).json({ status: true, message: 'Post Created!', data: post });
    } catch (err) {
        console.error(err);
        handleError(res, 500, 'Internal server error');
    }
};

exports.show = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await Post.findById(id);
        if (!post) {
            handleError(res, 404, 'Post not found');
            return;
        }

        res.status(200).json({ status: true, message: 'Post Found!', data: post });
    } catch (err) {
        console.error(err);
        handleError(res, 500, 'Internal server error');
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const post = await Post.findByIdAndUpdate(id, data, { new: true, runValidators: true });

        if (!post) {
            handleError(res, 404, 'Post not found');
            return;
        }

        res.status(200).json({ status: true, message: 'Post updated', data: post });
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ status: false, message: 'Validation error', errors: err.errors });
        } else {
            console.error(err);
            handleError(res, 500, 'Internal server error');
        }
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            handleError(res, 404, 'Post not found');
            return;
        }

        res.status(200).json({ status: true, message: 'Post deleted' });
    } catch (err) {
        console.error(err);
        handleError(res, 500, 'Internal server error');
    }
};
