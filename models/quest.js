const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
    level: {
        type: String,
        required: true,
        unique: true,
    },
    question: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
    },
    answer: {
        type: String,
    },
    nextLevelHint: {
        type: String,
    }
});

const Quest = mongoose.model('quest', questSchema);

module.exports = Quest;