if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        });
        console.log('Connected to Database');
    }

    catch(err) {
        console.log('error in connecting database');
        console.log(err);
    }
}

module.exports = { connect };