const db = require("../models");
const fs = require('fs');
const multer = require('multer');
const upload = require("../helper/upload.helper");
const Author = db.author;
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
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'author',
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
                    image: 1,
                    postCount: 1
                }
            }
        ];

        const [updatedDocs, countResult] = await Promise.all([
            Author.aggregate(pipeline),
            Author.aggregate([
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
            message: 'Authors Fetched!',
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
    try {
        upload.single('image')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // Handle Multer errors
                console.error(err);
                handleError(res, 400, err.message);
            } else if (err) {
                // Handle other errors
                console.error(err);
                handleError(res, 500, err.message);
            } else {
                // No error, proceed with creating the author

                const data = req.body;
                data.image = req.file ? req.file.path : ''; // Add the image path to the data object

                const model = new Author(data);
                const author = await model.save();

                res.status(200).json({status: true, message: 'Author Created!', data: author});
            }
        });
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
        const author = await Author.findById(id);

        if (!author) {
            handleError(res, 404, 'Author not found');
            return;
        }

        let imagePath = author.image; // Store the old image path

        upload.single('image')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // Handle Multer errors
                console.error(err);
                handleError(res, 400, err.message);
            } else if (err) {
                // Handle other errors
                console.error(err);
                handleError(res, 500, err.message);
            } else {
                // No error, proceed with updating the author

                if (req.file) {
                    // Delete the old image if it exists
                    if (imagePath && fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }

                    data.image = req.file.path; // Update the image path in the data object
                }

                const updatedAuthor = await Author.findByIdAndUpdate(id, data, {new: true, runValidators: true});

                res.status(200).json({status: true, message: 'Author updated', data: updatedAuthor});
            }
        });
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

        let imagePath = author.image; // Store the old image path
        if (imagePath && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

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
