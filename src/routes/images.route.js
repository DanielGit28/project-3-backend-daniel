import express from "express";
import cloudinary from "cloudinary";
const imageRouter = express.Router();
import dotenv from "dotenv";
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
                    console.log("Image uploaded: ", result);
                    res.send(result.url);
                })
                .catch((error) => {
                    console.log("Error uploading image: ", error);
                    res.send(JSON.stringify(error));
                })
        } catch (err) {
            next(err);
        }
    });

export default imageRouter;
