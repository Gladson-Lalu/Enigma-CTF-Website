const Score = require("../models/score");
const { refreshQuestions } = require('../services/google_spreadSheet_service');
viewPath = __dirname + "../views";

module.exports.root_get = (_req, res) => {
    res.redirect('/index.html');
}

module.exports.index_get = (_req, res) => {
    res.sendFile(viewPath + '/index.html');
}

module.exports.hackerboard_get = async(_req, res) => {
    const scores = await Score.find();
    const teamList = [];
    scores.forEach((team) => {
        teamList.push({
            name: team.teamName,
            level: team.level,
            time: msToTime(team.totalTime),
            score: team.totalScore
        })
    })
    teamList.sort((a, b) => b.score - a.score);
    res.render(viewPath + '/hackerboard.ejs', {
        teams: teamList
    });
}

module.exports.about_get = (_req, res) => {
    res.sendFile(viewPath + '/about.html');
}


module.exports.refresh = async function(req, res) {
    await refreshQuestions().then(res.status(200).json({
        done: "success"
    })).catch((e) => res.status(400).json({ error: "error" }));
}

function msToTime(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
}