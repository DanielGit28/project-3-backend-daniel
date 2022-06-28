 function contentHandler(req, res, next){
    if (!req.is('application/json')) {
        res.send("JSON format not valid or not implemented in the request for post ");
        res.end();
    } else {
        next();
    }   
}

export default contentHandler;