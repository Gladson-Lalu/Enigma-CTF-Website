const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    teamName: {
        type: String,
        require: [true, 'Please enter your team name'],
        unique: true
    },
    level: {
        type: Number,
        default: 0
    },
    totalScore: {
        type: Number,
        default: 0
    },
    totalTime: {
        type: Number,
        required: true
    },
    completedLevel: [{
        levelId: String,
        time: Number,
        score: Number
    }],
});


const Score = mongoose.model('teamScore', scoreSchema);

module.exports = Score;