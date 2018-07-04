var express = require('express');
var router = express.Router();
const blockchain = require('../src/blockchaincore');

router.get('/', function(req, res){
    res.status(200).send(blockchain);
});

router.get('/generate', function(req, res){
    blockchain.generateBlock();
    res.status(200).send(blockchain);
});

router.post('/receive', function(req, res){
    const newBlock = req.body.block;
    blockchain.receive(newBlock, function(res, msg){
        if (res === null) {
            res.status(401).send({msg: msg});
        }
    });
    res.status(200).send(blockchain);
});

router.get('/consensus', function(req, res){
    blockchain.consensus();
    res.status(200).send(blockchain);
});
module.exports = router;