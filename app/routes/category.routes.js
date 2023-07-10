const {authJwt} = require("../middlewares");
const controller = require("../controllers/category.controller");

module.exports = function (router) {
    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    router.get("/categories", [authJwt.verifyToken], controller.index);
    router.post('/categories', [authJwt.verifyToken], controller.store);
    router.get('/categories/:id', [authJwt.verifyToken], controller.show);
    router.put('/categories/:id', [authJwt.verifyToken], controller.update);
    router.delete('/categories/:id', [authJwt.verifyToken], controller.delete);
};
