const express = require('express');
const { dbUrl } = require('./config.js');
const authRoute = require('./routes/auth_routes');
const rootRoute = require('./routes/root_routes');
const questRoute = require('./routes/question_routes');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

viewPath = __dirname + "/views";
const app = express();
app.use(express.static('public'));
app.set('view-engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(authRoute);
app.use(rootRoute);
app.use(questRoute);
app.get('*', (req, res) => {
    res.sendFile(viewPath + '/404.html');
});



mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(() => app.listen(process.env.PORT || 3000))
    .catch((err) => console.log(err));