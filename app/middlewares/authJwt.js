const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

// Middleware function to validate token and retrieve user data
const authenticateUser = async (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send({message: 'No token provided'});
    }

    try {
        const decoded = jwt.verify(token, config.secret);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).send({message: 'User not found'});
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(403).send({message: 'Invalid token'});
    }
};

verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send({message: 'No token provided'});
    }

    try {
        const decoded = jwt.verify(token, config.secret);

        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(403).json({status: false, message: 'Invalid token!'});
    }
};

isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).exec();

        if (!user) {
            return res.status(404).send({message: 'User not found'});
        }

        const roles = await Role.find({_id: {$in: user.roles}}).exec();

        let isAdmin = false;
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === 'admin') {
                isAdmin = true;
                break;
            }
        }

        if (isAdmin) {
            next();
        } else {
            res.status(403).send({message: 'Require Admin Role!'});
        }
    } catch (err) {
        res.status(500).send({message: err});
    }

};

isModerator = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).exec();

        if (!user) {
            return res.status(404).send({message: 'User not found'});
        }

        const roles = await Role.find({_id: {$in: user.roles}}).exec();

        let isModerator = false;
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === 'moderator') {
                isModerator = true;
                break;
            }
        }

        if (isModerator) {
            next();
        } else {
            res.status(403).send({message: 'Require Moderator Role!'});
        }
    } catch (err) {
        res.status(500).send({message: err});
    }
};

const authJwt = {
    authenticateUser,
    verifyToken,
    isAdmin,
    isModerator
};
module.exports = authJwt;
