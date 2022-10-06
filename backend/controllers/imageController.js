const asyncHandler = require('express-async-handler')
const fs = require('fs');
const AWS = require("aws-sdk");
const ImageFile = require('../models/imageModel')
const dotenv = require('dotenv').config();

// function to save image
const saveImage = async (model_id ,imageable_type ,path , caption ) => {

    const s3 = new AWS.S3({
        region:process.env.AWS_BUCKET_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    })

    //const imageURL = path;
    //const res = await fetch(imageURL)
    //const blob = await res.buffer()

    //const imagePath = req.files[0].path
    //const blob = fs.readFileSync(imagePath)
    /*const blob = fs.readFileSync(path);
    const uploadedImage = await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: req.files[0].originalFilename,
        Body: blob
    }).promise()*/

    const fileName = 'server.js';

    const uploadFile = () => {
        fs.readFile(fileName, (err, data) => {
            if (err) throw err;
            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME, // pass your bucket name
                Key: 'contacts.csv', // file will be saved as testBucket/contacts.csv
                Body: JSON.stringify(data, null, 2)
            };
            s3.upload(params, function(s3Err, data) {
                if (s3Err) throw s3Err
                console.log(`File uploaded successfully at ${data.Location}`)
            });
        });
    };

    uploadFile()

    /*/return await Image.create({
        model_id: model_id,
        imageable_type: imageable_type,
        path:uploadedImage.Location,
        caption:caption
    })*/
}
module.exports = {
    saveImage
}
