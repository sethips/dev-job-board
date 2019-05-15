const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const JobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    keywords: {
        type: Array,
        required: true
    },
    scrapedFrom: {
        type: String,
        required: false
    },
    datePosted: {
        type: String,
        required: true
    }
});

module.exports = Job = mongoose.model('jobs', JobSchema);