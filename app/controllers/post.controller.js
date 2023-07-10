const db = require("../models");
const Post = db.post;
const Author = db.author;
const CategoryPost = db.category_post;
const handleError = (res, statusCode, message) => {
    res.status(statusCode).json({status: false, message});
};

exports.index = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', '_id -status')
            .select('title content status date author');
        res.status(200).json({status: true, message: 'Posts Fetched!', data: posts});
    } catch (err) {
        console.error(err);
        handleError(res, 500, 'Internal server error');
    }
};

exports.store = async (req, res) => {
    try {
        const {author_id, categories_ids, ...data} = req.body;

        // Check if the author exists
        const author = await Author.findById(author_id);
        if (!author) {
            return res.status(404).send({message: 'Author not found'});
        }

        // Create a new post and associate it with the author
        const model = new Post({
            ...data,
            author: author._id
        });
        const post = await model.save();

        // Create the relationships in the CategoryPost collection
        for (const categoryId of categories_ids) {
            const categoryPost = new CategoryPost({
                post: post._id,
                category: categoryId
            });

            await categoryPost.save();
        }

        res.status(200).json({status: true, message: 'Post Created!', data: post});
    } catch (err) {
        console.error(err);
        handleError(res, 500, 'Internal server error');
    }
};

exports.show = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await Post.findById(id)
            .populate('author', '_id -status')
            // .populate({
            //     path: 'category_post', // Update this to match the field name in your Post model
            //     populate: {
            //         path: 'category',
            //         select: 'name'
            //     }
            // })
            .select('title content status date author');
        if (!post) {
            handleError(res, 404, 'Post not found');
            return;
        }

        res.status(200).json({status: true, message: 'Post Found!', data: post});
    } catch (err) {
        console.error(err);
        handleError(res, 500, err);
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    const {author_id, categories_ids, ...data} = req.body;

    try {
        // Check if the author exists
        const author = await Author.findById(author_id);
        if (!author) {
            return res.status(404).send({message: 'Author not found'});
        }

        const post = await Post.findByIdAndUpdate(id, {...data, author: author._id}, {new: true, runValidators: true});

        if (!post) {
            handleError(res, 404, 'Post not found');
            return;
        }

        // Delete existing relationships in the CategoryPost collection
        await CategoryPost.deleteMany({post: id});

        // Create new relationships in the CategoryPost collection
        for (const categoryId of categories_ids) {
            const categoryPost = new CategoryPost({
                post: id,
                category: categoryId
            });

            await categoryPost.save();
        }

        res.status(200).json({status: true, message: 'Post updated', data: post});
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
        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            handleError(res, 404, 'Post not found');
            return;
        }

        // Delete the relationships in the CategoryPost collection
        await CategoryPost.deleteMany({post: id});

        res.status(200).json({status: true, message: 'Post deleted'});
    } catch (err) {
        console.error(err);
        handleError(res, 500, 'Internal server error');
    }
};
