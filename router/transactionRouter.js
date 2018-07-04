var express = require('express');
var router = express.Router();
const blockchain = require('../src/blockchaincore');
const transactions = require('../src/transactions')

router.get('/list', function(req, res){
    res.status(200).send(transactions);
});

router.post('/register', function(req, res){
    const transaction = req.body.transaction;
    transactions.register(transaction);
    res.status(200).send(blockchain);
});

router.post('/add', function(req, res){
    const transaction = req.body.transaction;
    transactions.add(transaction);
    res.status(200).send(blockchain);
});

router.get('/register/:sendor/:recipient/:amount', function(req, res){
    const sendor = req.params.sendor;
    const recipient = req.params.recipient;
    const amount = req.params.amount;
    transactions.register({sendor: sendor, recipient: recipient, amount: amount});
    res.status(200).send(blockchain);
});

module.exports = router;