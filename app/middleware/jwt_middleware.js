const jwt = require("jsonwebtoken");

const jwtMiddleware = (request, response, next) => {
    const token = request.headers["token"];
    console.log(request.path);
    if (request.path === "/login" || request.path === "/register") {
        next();
    } else {
        jwt.verify(token, "secretkey", (err, authData) => {
            console.log(err);
            if (err) {
                response.status(403).json({
                    message: "Forbidden",
                    code: 403,
                    status: "error",
                });
            } else {
                next();
            }
        });
    }
};

module.exports = {
    jwtMiddleware,
};
