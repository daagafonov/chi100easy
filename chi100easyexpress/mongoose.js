const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_SERVER_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}, () => {
    console.log('connected to db');
});


module.exports = mongoose;
