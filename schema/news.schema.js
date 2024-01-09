const mongoose = require('mongoose');

const News = new mongoose.Schema({
    date: String,
    title: String,
    href: String,
    info: String,
    image: String
});

module.exports = mongoose.model('news', News);
