const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const blockchainRouter = require('./router/blockchainRouter');
const nodeRouter = require('./router/nodeRouter');
const transactionRouter = require('./router/transactionRouter');

const networkNode = require('./src/network');

const port = process.argv[2];
const thisNodeUrl = process.argv[3];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

networkNode.createInstance(thisNodeUrl);
app.use('/node', nodeRouter);
app.use('/blockchain', blockchainRouter);
app.use('/transaction', transactionRouter)

app.listen(port, function() {
    console.log(`listening ${port}`);
})
