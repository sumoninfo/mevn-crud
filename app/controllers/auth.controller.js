const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        });

        await user.save();

        if (req.body.roles) {
            const roles = await Role.find({name: {$in: req.body.roles}});
            user.roles = roles.map(role => role._id);
        } else {
            const role = await Role.findOne({name: "user"});
            user.roles = [role._id];
        }

        await user.save();
        res.send({message: "User was registered successfully!"});
        //res.status(200).json({status: true, message: 'User was registered successfully!', data: user});
    } catch (err) {
        console.log(err, 'err')
        res.status(500).json({status: false, message: err});
    }
};

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username})
            .populate("roles", "-__v")
            .exec();

        if (!user) {
            return res.status(404).json({status: false, message: "User Not found."});
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({
                status: false,
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        const token = jwt.sign({id: user.id}, config.secret, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400 // 24 hours
        });

        const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase());

        // res.status(200).send({
        //     id: user._id,
        //     username: user.username,
        //     email: user.email,
        //     roles: authorities,
        //     accessToken: token
        // });

        res.status(200).json({
            status: true, message: 'User login successfully!', data: {
                access_token: token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                }
            }
        });
    } catch (err) {
        res.status(500).json({status: false, message: err});
    }
};

exports.user = async (req, res) => {

}
