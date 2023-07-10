const {authJwt} = require("../middlewares");
const controller = require("../controllers/author.controller");

module.exports = function (router) {
    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    router.get("/authors", [authJwt.verifyToken], controller.index);
    router.post('/authors', [authJwt.verifyToken], controller.store);
    router.get('/authors/:id', [authJwt.verifyToken], controller.show);
    router.put('/authors/:id', [authJwt.verifyToken], controller.update);
    router.delete('/authors/:id', [authJwt.verifyToken], controller.delete);
};
