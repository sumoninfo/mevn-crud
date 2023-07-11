const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.author = require("./author.model");
db.category = require("./category.model");
db.tag = require("./tag.model");
db.post = require("./post.model");
db.category_post = require("./categoryPost.model");
db.tag_post = require("./tagPost.model");
db.comment = require("./comment.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
