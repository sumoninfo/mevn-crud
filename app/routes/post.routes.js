const {authJwt} = require("../middlewares");
const controller = require("../controllers/post.controller");

module.exports = function (router) {
    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    router.get("/posts", [authJwt.verifyToken], controller.index);
    router.post('/posts', [authJwt.verifyToken], controller.store);
    router.get('/posts/:id', [authJwt.verifyToken], controller.show);
    router.put('/posts/:id', [authJwt.verifyToken], controller.update);
    router.delete('/posts/:id', [authJwt.verifyToken], controller.delete);
};
