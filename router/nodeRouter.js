var express = require('express');
var router = express.Router();
const networkNode = require('../src/network');

router.get('/', function(req, res, next) {
    res.status(200).send(networkNode.getInstance());
});

router.get('/list', function(req, res) {
    res.status(200).send(networkNode.getInstance());
});

router.post('/register', function(req, res) {
    const nodeUrl = req.body.nodeUrl;

    const network = networkNode.getInstance();
    network.register(nodeUrl);
    res.status(200).send(network);
});

router.post('/add', function(req, res) {
    const nodeUrl = req.body.nodeUrl;

    const network = networkNode.getInstance();
    network.add(nodeUrl);
    res.status(200).send(network);
});

router.post('/addlist', function(req, res) {
    const nodeUrls = req.body.nodeUrls;
    console.log(nodeUrls);

    const network = networkNode.getInstance();
    network.addlist(nodeUrls);
    res.status(200).send(network);
});

module.exports = router;