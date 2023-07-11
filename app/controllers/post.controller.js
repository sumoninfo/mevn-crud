const db = require("../models");
const Post = db.post;
const Author = db.author;
const CategoryPost = db.category_post;
const TagPost = db.tag_post;
const Comment = db.comment;
const handleError = (res, statusCode, message) => {
    res.status(statusCode).json({status: false, message});
};

exports.index = async (req, res) => {
    const reqPage = parseInt(req.query.page) || 1;  // Current page number
    const pageSize = parseInt(req.query.per_page) || 10;  // Number of items per page

    const options = {
        page: reqPage,
        limit: pageSize,
        populate: [
            {
                path: 'author',
                select: '_id -status'
            },
            {
                path: 'categories',
                populate: {
                    path: 'categoryId',
                    select: 'title'
                }
            },
            {
                path: 'tags',
                populate: {
                    path: 'tagId',
                    select: 'title'
                }
            },
            {
                path: 'comments',
                populate: {
                    path: 'commentable',
                    select: 'comment'
                }
            }
        ],
        select: 'title content status date author'
    };

    try {
        const result = await Post.paginate({}, options);

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
            status: true, message: 'Posts Fetched!', data: {
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
    try {
        const {author_id, categories_ids, tags_ids, comment, ...data} = req.body;

        // Check if the author exists
        const author = await Author.findById(author_id);
        if (!author) {
            return handleError(res, 404, 'Author not found');
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
                postId: post._id,
                categoryId: categoryId
            });

            await categoryPost.save();
        }

        // Create the relationships in the TagPost collection
        for (const tagId of tags_ids) {
            const tagPost = new TagPost({
                postId: post._id,
                tagId: tagId
            });

            await tagPost.save();
        }

        const commentOnBook = await Comment.create({
            comment,
            commentable: post._id,
            commentableType: 'Post'
        });

        res.status(200).json({status: true, message: 'Post Created!', data: post});
    } catch (err) {
        console.error(err);
        handleError(res, 500, err);
    }
};

exports.show = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await Post.findById(id)
            .populate('author', '_id -status')
            .populate({
                path: 'categories',
                populate: {
                    path: 'categoryId',
                    select: 'title'
                }
            })
            .populate({
                path: 'tags',
                populate: {
                    path: 'tagId',
                    select: 'title'
                }
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'commentable',
                    select: 'body'
                }
            })
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
    const {author_id, categories_ids, tags_ids, comment, ...data} = req.body;

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
        await CategoryPost.deleteMany({postId: id});

        // Create new relationships in the CategoryPost collection
        for (const categoryId of categories_ids) {
            const categoryPost = new CategoryPost({
                postId: id,
                categoryId: categoryId
            });

            await categoryPost.save();
        }

        // Delete existing relationships in the CategoryPost collection
        await TagPost.deleteMany({postId: id});

        // Create new relationships in the TagPost collection
        for (const tagId of tags_ids) {
            const tagPost = new TagPost({
                postId: id,
                tagId: tagId
            });

            await tagPost.save();
        }

        // Delete existing relationships in the CategoryPost collection
        await Comment.deleteMany({commentable: id});

        const commentOnBook = await Comment.create({
            comment,
            commentable: post._id,
            commentableType: 'Post'
        });

        res.status(200).json({status: true, message: 'Post updated', data: post});
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
        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            handleError(res, 404, 'Post not found');
            return;
        }

        // Delete the relationships in the CategoryPost collection
        await CategoryPost.deleteMany({postId: id});

        // Delete the relationships in the TagPost collection
        await TagPost.deleteMany({postId: id});

        // Delete the relationships in the TagPost collection
        await Comment.deleteMany({commentable: id});

        res.status(200).json({status: true, message: 'Post deleted'});
    } catch (err) {
        console.error(err);
        handleError(res, 500, err);
    }
};
