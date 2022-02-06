const jwt = require('jsonwebtoken');
const Score = require('../models/score');
const { jwtSecretKey } = require('../config');

const requireAuth = (req, res, next) => {
    const token = req.cookies.auth;
    if (token) {
        jwt.verify(token, jwtSecretKey, async(err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login.html');
            } else {
                const teamScore_ = await Score.findById(decodedToken.id);
                if (teamScore_) {
                    res.locals.teamScore = teamScore_;
                    next();
                } else {
                    res.locals.id = null;
                    res.redirect('/login.html');
                }
            }
        });
    } else {
        res.redirect('/login.html');
    }
};

module.exports = { requireAuth };