const express = require('express');
const router = express.Router();
const auth = require('../controller/auth');

module.exports = app => {

    router.post('/login', auth.login)

   

    app.use('/api', router);
}