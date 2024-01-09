const mongoose = require('mongoose');

const connection = ()=>{
    mongoose.connect('mongodb://localhost/newscraper', () => {
        console.log("Database Connected");
    });
}

module.exports = connection;