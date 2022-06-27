const express = require("express");
const cloudinary = require("cloudinary").v2;
const imageRouter = express.Router();
const dotenv = require("dotenv");
dotenv.config();

imageRouter
    .route("/upload")
    // Upload image on cloudinary and get the url
    .post(async (req, res, next) => {
        const imageData = req.body.image;

        try {
            cloudinary.uploader
            .upload(imageData, {
                resource_type: "image",
            })
            .then((result) => {
                console.log("Image uploaded: ",result);
                res.send(result.url);
            })
            .catch((error) => {
                console.log("Error uploading image: ",error);
                res.send(JSON.stringify(error));
            })
        } catch (err) {
            next(err);
        }
    });

module.exports = imageRouter;
