const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./key.json');
const { registrationSpreadsheetId, questionSpreadSheetId } = require('../config');

var regSheet;
var questSheet;
var questRows;

async function verifyTeam({ token, teamName }) {

    if (!regSheet) {
        try {
            regSheet = new GoogleSpreadsheet(registrationSpreadsheetId);
            await regSheet.useServiceAccountAuth({
                client_email: creds.client_email,
                private_key: creds.private_key,
            });
            await regSheet.loadInfo();
        } catch (err) {
            throw err;
        }
    }
    const rows = await regSheet.sheetsByIndex[1].getRows();
    token = token.replace(/\s/g, '');
    const row = rows.find((row, _index, _obj) => {
        return row.Token.replace(/\s/g, '') === token;
    });
    if (row) {
        if (teamName.replace(/\s/g, '').toLowerCase() === row.Name.replace(/\s/g, '').toLowerCase())
            return true;
        else {
            throw Error("incorrect TeamName");
        }
    } else {
        throw Error("token not found");
    }
}

async function getQuestions() {
    try {
        if (!questRows) {
            await refreshQuestions();
        }
        return questRows;
    } catch (err) {
        console.log(err);
    }
}


async function refreshQuestions(next) {
    questSheet = new GoogleSpreadsheet(questionSpreadSheetId);
    try {
        await questSheet.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
        });

        await questSheet.loadInfo();
        questRows = await questSheet.sheetsByIndex[0].getRows();
    } catch (err) {
        console.log(err);
    }
}
module.exports = { verifyTeam, getQuestions, refreshQuestions };