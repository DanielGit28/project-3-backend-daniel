

module.exports = {
    errorHandler: function (err, req, res, next) {
        console.log(err);
       res.send(err._message);
    }
}