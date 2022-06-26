module.exports = {
    loggerHandler: function (req, res, next) {
        console.log(req.get("Content-Type"));
        console.log(req.body);
        console.log(req.originalUrl);
        next();
    }
}