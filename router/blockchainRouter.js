var express = require('express');
var router = express.Router();
const core = require('../src/blockchaincore');

router.get('/', function(req, res){
    res.status(200).send(core);
});

router.get('/generate', function(req, res){
    core.generateBlock();
    res.status(200).send(core);
});

router.post('/receive', function(req, res){
    const newBlock = req.body.block;
    core.receive(newBlock, function(res, msg){
        if (res === null) {
            res.status(401).send({msg: msg});
        }
    });
    res.status(200).send(core);
});

module.exports = router;