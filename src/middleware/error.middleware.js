 function errorHandler(err, req, res, next) {
    console.log(err);
   res.send(err._message);
}
 
export default errorHandler;