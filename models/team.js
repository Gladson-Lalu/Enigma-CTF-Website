const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: [true, 'Please enter your team name'],
        unique: true,
        lowercase: true,
    },
    teamToken: {
        type: String,
        required: [true, 'Please enter your team Token'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
    },
});


// fire a function before doc saved to db
teamSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to login user
teamSchema.statics.login = async function (teamName, password) {
    const team = await this.findOne({ teamName });
    if (team) {
        const auth = await bcrypt.compare(password, team.password);
        if (auth) {
            return team;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect TeamName');
};

const Team = mongoose.model('team', teamSchema);

module.exports = Team;