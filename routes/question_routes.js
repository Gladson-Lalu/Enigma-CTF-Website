const { Router } = require('express');
const questController = require('../controllers/question_controller');
const { requireAuth } = require('../middleware/authMiddleware');
const { getQuestions } = require('../services/google_spreadSheet_service');

const router = Router();
viewPath = __dirname + "../views";

router.get('/instructions.html', requireAuth, questController.instruction_get);
router.get('/:name', requireAuth, async(req, res, next) => {
    try {
        const name = req.params.name;
        const questions = await getQuestions();
        const question = questions.find(element => element.Route_url == name);
        if (question) {
            res.locals.question = question;
            questController.quest_get(req, res);
        } else {
            res.sendFile(viewPath + '/404.html')
        }
    } catch (err) {
        console.log(err);
    }
});
router.post('/:name', requireAuth, async(req, res, next) => {
    try {
        const name = req.params.name;
        const questions = await getQuestions();
        const question = questions.find(element => element.Route_url == name);
        if (question) {
            res.locals.question = question;
            await questController.quest_post(req, res);
        }
    } catch (err) {
        console.log(err);
    }
});
module.exports = router;