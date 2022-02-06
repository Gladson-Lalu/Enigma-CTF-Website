const Team = require("../models/team");
const Score = require("../models/score");
const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../config');
const { verifyTeam } = require('../services/google_spreadSheet_service');


// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { team: '', password: '', token: '' };

    // incorrect team name
    if (err.message === 'incorrect TeamName') {
        errors.team = 'Incorrect team name';
    }

    //token not found
    if (err.message === 'token not found') {
        errors.token = 'Token is incorrect';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'Password is incorrect';
    }


    // duplicate team name error
    if (err.code === 11000) {
        if (err.message.includes("teamToken_1 dup"))
            errors.token = 'Token is already registered';
        else
            errors.team = 'Team is already registered';
    }

    // validation errors
    if (err.message.includes('team validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

// create json web token
const maxAge = 2 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, jwtSecretKey, {
        expiresIn: maxAge
    });
};

viewPath = __dirname + "../views";

// Get methods
module.exports.signup_get = (req, res) => {
    res.sendFile(viewPath + '/register.html')
}

module.exports.login_get = (req, res) => {
    res.sendFile(viewPath + '/login.html')
}

module.exports.logout_get = (req, res) => {
    res.cookie('auth', '', { maxAge: 1 });
    res.redirect('/');
}



//POST methods
module.exports.signup_post = async(req, res, next) => {
    const { teamToken, teamName, password } = req.body;
    try {
        const findInSheet = await verifyTeam({ token: teamToken, teamName });
        if (findInSheet) {
            const team = await Team.create({ teamName, teamToken, password });
            const time = new Date().getTime();
            await Score.create({ teamName, '_id': team._id, 'totalTime': 0, 'level': 0, 'completedLevel': [] });
            const token = createToken(team._id);
            res.cookie('auth', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.redirect('/instructions.html')
            next();
        }
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

}

module.exports.login_post = async(req, res) => {
    const { teamName, password } = req.body;
    try {
        const user = await Team.login(teamName, password);
        const token = createToken(user._id);
        res.cookie('auth', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.redirect('/instructions.html');
    } catch (err) {
        const errors = handleErrors(err);

        res.status(400).json({ errors });
    }

}