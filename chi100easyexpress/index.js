const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const fileUpload = require('express-fileupload');

require('custom-env').env(true);

console.log("node env ", process.env.NODE_ENV);

const mongoose = require('./mongoose');

const src = require('./src');
const api = src.router.api;

const app = express();


app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(fileUpload({
    // useTempFiles : true,
    limits: {fileSize: 50 * 1024 * 1024},
    // tempFileDir : '/tmp/',
    debug: true,
}));


app.use(process.env.API_CONTEXT_PATH, api);
const port = process.env.PORT;


// app.use(function(err, req, res, next) {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

app.listen(port, () => {
    console.log(`Server up and running, listening on http://localhost:${port}${process.env.API_CONTEXT_PATH}/users`);
});
