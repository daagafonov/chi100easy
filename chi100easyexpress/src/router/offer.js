const express = require("express");
const router = express.Router();
const fs = require('fs');
const mongoose = require('mongoose');
const db = require('../model');
const utils = require('./utils');

router.get('/', async (req, res) => {
    try {
        const offers = await db.actions.offer.findAll(req.params.userId);
        res.json(offers);
    } catch (error) {
        console.error(error);
        utils.resError(res, error);
    }
});

router.get('/firstAvailable', async (req, res) => {
    try {
        const offer = await db.actions.offer.findFirstAvailable();
        res.json(offer);
    } catch (error) {
        console.error(error);
        utils.resError(res, error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await db.actions.offer.getOfferWithPopulateImage(req.params.id);
        if (order) {
            res.json(order);
        } else {
            utils.resNotFound(res, 'not found');
        }
    } catch (error) {
        utils.resError(res, error);
    }
});

router.get('/:id/image', async (req, res) => {
    try {

        const offer = await db.actions.offer.getOfferWithPopulateImage(req.params.id);

        if (!offer) {
            return utils.resNotFound(res, 'not found');
        }

        const gridfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            chunkSizeBytes: 1024,
            bucketName: 'offerpicture'
        });

        await gridfs.openDownloadStreamByName(offer._id)
            .pipe(fs.createWriteStream(`/tmp/${offer._id}`))
            .on('error', function (error) {
                utils.resError(res, error);
            })
            .on('finish', () => {
                res.download(`/tmp/${offer._id}`, offer.image.name, {
                    headers: {
                        'Content-Type': offer.image.type
                    }
                });
            });
    } catch (error) {
        utils.resError(res, error);
    }
});

router.post('/', async (req, res) => {

    const future = {
        shortDescription: req.body.shortDescription,
        longDescription: req.body.longDescription,
        validFrom: req.body.validFrom,
        validTo: req.body.validTo,
    };

    try {
        const created = await db.actions.offer.create(future);

        const {name, mimetype, size, md5} = req.files.file;
        const fileNameWOPath = `${new Date().getTime()}-${name}`;
        const fileName = `/tmp/${fileNameWOPath}`;

        await req.files.file.mv(fileName, async (error) => {

            const gridfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                chunkSizeBytes: 1024,
                bucketName: 'offerpicture'
            });

            fs.createReadStream(fileName).pipe(gridfs.openUploadStream(created._id)).on('error', function (error) {
                res.json(utils.makeError(error));
            }).on('finish', async () => {

                const doc = await db.actions.document.create({
                    name,
                    type: mimetype,
                    size,
                    md5,
                });

                await db.actions.offer.updateOne(created._id, {
                    image: doc._id
                });

                res.json({
                    ok: true,
                    message: 'OK'
                });
            });

        });
    } catch (error) {
        console.log('error', error);
        utils.resError(res, error);
    }
});

router.put('/:id', async (req, res) => {

    const order = {
        shortDescription: req.body.shortDescription,
        longDescription: req.body.longDescription,
        validFrom: req.body.validFrom,
        validTo: req.body.validTo,
        updated_dt: new Date(),
    };

    try {
        const saved = await db.actions.offer.updateOne(req.params.id, order);
        console.log(saved);
        res.json(saved);
    } catch (error) {
        utils.resError(res, error);
    }
});

module.exports = router;
