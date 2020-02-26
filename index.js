// https://d-d-n-a.com
const http = require('http');
const express = require('express');
const path = require('path');

const port = 3000;

const app = express();
app.use('/', (req, res, next) => {
    console.log(req.connection.remoteAddress);
    next();
});
app.use('/', express.static('./public'));
app.get(['/:section', '/:section/:item'], (req, res) => {
    let section, item;
    section = req.params.section;
    if (req.params.item) item = req.params.item;

    console.log(section, item);
    res.sendFile(path.join(__dirname, './public/index.html'));
})

const server = http.createServer(app);
server.listen(port, function () {
    console.log(`http://192.168.0.63:${port}`);
});