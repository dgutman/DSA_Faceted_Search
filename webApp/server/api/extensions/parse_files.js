const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mv = require('mv');

const images_folder = require('../../../config').images_folder;
const facetImages = require('../models/facet_images');
const {facets, filters} = require('../extensions/create_facets');

// const facetImages = new FacetImages();

const parse = (arr, filter, cb, message) => {
    const length = arr.length ? arr.length : 0;

    if (length % 500 === 0) {
        message(`${length} files in change, ${new Date()}`);
    }

    if (arr.length) {
        const directory = arr.shift();

        const mongo_object = {};
        let jsonFilePath;
        let imageFilePath;
        const files = fs.readdirSync(directory);
        let onlyJson = false;
        if(files.length === 2){
            const jsonFileName = (path.extname(files[0]) === '.json')
                ? files[0]
                : files[1];
            const imageFileName = (path.extname(files[0]) === '.json')
                ? files[1]
                : files[0];
            const hash = crypto.createHash('sha256');

            // forming ready to use path's for json & image
            jsonFilePath = path.join(directory, jsonFileName);
            imageFilePath = path.join(directory, imageFileName);

            // create unig image name with right extension
            hash.update(imageFileName + new Date() + Math.random());

            // save new uniq image name
            mongo_object.filename = hash.digest('hex') + path.extname(imageFileName);
        } else {
            jsonFilePath = path.join(directory, files[0]);
            onlyJson = true;
        }

        // save json data to object
        mongo_object.data = JSON.parse(fs.readFileSync(jsonFilePath));

        // cork
        // mongo_object.facets = [];
        mongo_object.facets = facets(mongo_object.data);
        filter = filters(filter, mongo_object.facets);

        if(onlyJson){
            mongo_object.filesrc = mongo_object.data.largeImage.src || null;
            mongo_object.filename = null;
            facetImages.insertImage(mongo_object, function () {
                parse(arr, filter, cb, message);
            });
        } else {
        // move image to special folder from config
            mv(
                imageFilePath,
                path.join(images_folder, mongo_object.filename),
                function (err) {
                    if(err){
                        message('item did not save' + mongo_object.data.name);
                        console.log('item did not save' + mongo_object.data.name);
                        console.log(err);
                        parse(arr, filter, cb, message);
                    } else {
                        facetImages.insertImage(mongo_object, function () {
                            parse(arr, filter, cb, message);
                        });
                    }
                }
            );
        }

    } else cb(filter); // if array empty, all is done
};

const parseFiles = (arr, message) => {
    message('[Files]: starting');
    return new Promise(function (resolve) {
        parse(arr, {}, function (data) {
            message('[Files]: finished');
            resolve(data);
        }, message);
    });
};

module.exports = parseFiles;
