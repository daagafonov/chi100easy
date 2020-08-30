const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");


require('custom-env').env(true);

console.log("node env ", process.env.NODE_ENV);

const mongoose = require('./mongoose');

const api = require('./router/api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(process.env.API_CONTEXT_PATH, api);
const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server up and running, listening on http://localhost:${port}${process.env.API_CONTEXT_PATH}/users`);
});
