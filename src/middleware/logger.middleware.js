 function loggerHandler(req, res, next) {
    console.log(req.get("Content-Type"));
    console.log(req.body);
    console.log(req.originalUrl);
    next();
}
export default loggerHandler;