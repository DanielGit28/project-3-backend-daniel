const jwt = require('jsonwebtoken');


module.exports = {
    authenticateToken: function (req, res, next) {
        console.log("auth middleware");
        console.log("Headers: ", req.headers);
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            console.log(err)

            if (err) return res.json("Session expired")

            req.user = user

            next()
        })
    }
}