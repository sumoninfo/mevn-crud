const {authJwt} = require("../middlewares");
const controller = require("../controllers/tag.controller");

module.exports = function (router) {
    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    router.get("/tags", [authJwt.verifyToken], controller.index);
    router.post('/tags', [authJwt.verifyToken], controller.store);
    router.get('/tags/:id', [authJwt.verifyToken], controller.show);
    router.put('/tags/:id', [authJwt.verifyToken], controller.update);
    router.delete('/tags/:id', [authJwt.verifyToken], controller.delete);
};
