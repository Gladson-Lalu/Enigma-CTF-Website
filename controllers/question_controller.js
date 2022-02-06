const Score = require('../models/score');
const {
    getQuestions
} = require('../services/google_spreadSheet_service');


viewPath = __dirname + "../views";
module.exports.instruction_get = (req, res) => {
    res.sendFile(viewPath + '/instructions.html');
}

module.exports.quest_get = async(req, res) => {
    const teamScore = res.locals.teamScore;
    const quest = res.locals.question;
    const questList = await getQuestions();
    let remainingList = [];
    questList.forEach(element => {
        if ((element.Level == teamScore.level && quest.Route_url != element.Route_url)) {
            if (!teamScore.completedLevel.find(e => e.levelId == element.Route_url)) {
                remainingList.push(element.NextPlaceHint);
            }
        }
    });

    if (teamScore) {
        if (quest) {
            if (quest.Level === 99) {
                res.render(viewPath + '/quest.ejs', {
                    teamLevel: teamScore.level,
                    score: teamScore.totalScore,
                    questLevel: 'fake',
                    imageUrl: quest.Image_url,
                    caption: quest.Caption,
                    teamName: teamScore.teamName,
                    remainingList: remainingList,
                    pass: false,
                });
            } else if (teamScore.level >= quest.Level) {
                res.render(viewPath + '/quest.ejs', {
                    teamLevel: teamScore.level,
                    score: teamScore.totalScore,
                    questLevel: quest.Level,
                    imageUrl: quest.Image_url,
                    caption: quest.Caption,
                    teamName: teamScore.teamName,
                    remainingList: remainingList,
                    pass: true
                });
            } else {
                res.render(viewPath + '/quest.ejs', {
                    teamLevel: teamScore.level,
                    score: teamScore.totalScore,
                    questLevel: quest.Level,
                    imageUrl: 'lock.jpg',
                    caption: "എടാ മോനെ അത് ലോക്കാ (You need to increase your level to unlock this quest)",
                    teamName: teamScore.teamName,
                    pass: false
                });

            }
        }
    } else {
        res.redirect('/login.html');
    }
}
async function updateScore({
    quest,
    teamScore
}) {
    const totalScore = parseInt(teamScore.totalScore) + parseInt(quest.Score);
    let currentTime = new Date().getTime();
    let diff = 0
    if (teamScore.level != 0) {
        diff = currentTime - parseInt(teamScore.completedLevel[teamScore.completedLevel.length - 1].time);
    }
    let totalTime = parseInt(teamScore.totalTime) + diff;
    const completedList = teamScore.completedLevel;
    completedList.push({
        levelId: quest.Route_url,
        time: currentTime,
        score: totalScore
    });
    try {
        var level = parseInt(teamScore.level)
        let questList = await getQuestions();
        let remainingList = [];
        for (var i = 0; i < questList.length; i++) {
            const el = questList[i];
            if ((el.Level == teamScore.level && quest.Route_url != el.Route_url)) {
                if (!teamScore.completedLevel.find(e => e.levelId == el.Route_url)) {
                    remainingList.push(el.NextPlaceHint);
                    break;
                }
            }
        }
        if (remainingList.length == 0) {
            level += 1;
        }
        await Score.findByIdAndUpdate(teamScore._id, {
            totalScore,
            totalTime,
            level,
            completedLevel: completedList
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports.quest_post = async(req, res) => {
    const teamScore = res.locals.teamScore;
    const quest = res.locals.question;
    if (teamScore) {
        if (quest) {
            if (teamScore.completedLevel != 0 && teamScore.completedLevel.find(element => element.levelId == req.params.name)) {
                res.status(400).json({
                    message: "The level is already completed"
                });
            } else {
                const {
                    answer
                } = req.body;
                if (`enigma{${quest.Answer.replace(/\s/g, '')}}`.toLocaleLowerCase() == answer.replace(/\s/g, '').toLowerCase()) {
                    await updateScore({
                        quest,
                        teamScore
                    }).then(res.status(200).json({
                        done: 'success'
                    }));
                } else {
                    res.status(400).json({
                        message: "incorrect answer"
                    });
                }
            }
        }
    } else {
        res.redirect('/login.html');
    }
}