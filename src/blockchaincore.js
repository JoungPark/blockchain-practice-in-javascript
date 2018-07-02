const axios = require('axios');
const sha256 = require('sha256');
const transactions = require('./transactions')
const networkNode = require('../src/network');

function Blockchain() {
    this.difficulty = 4;
    this.chain = [];
    this.transactions = transactions;

    this.createNewBlock(100, '0', '0');     // first block
}

Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
};

Blockchain.prototype.generateBlock = function() {
    let previousBlockHash = this.getLastBlock().hash;
    let proofOfWork = this.proofOfWork();
    let nonce = proofOfWork.nonce;
    let hash = proofOfWork.hash;
    
    let newBlock = this.createNewBlock(nonce, previousBlockHash, hash);

    const axiosPromises = [];
    networkNode.getInstance().networkNodeUrls.forEach(url => {
        axiosPromises.push(
            axios({
                method: 'post',
                url: url + '/blockchain/receive',
                data: {
                    block: newBlock
                }
            })
        );
    });
    Promise.all(axiosPromises)
    .then(function (res) {
        console.log('Promise success');
    })
    .catch(function (err) {
        console.log(err);
    });
};

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamps: Date.now(),
        previousBlockHash: previousBlockHash,
        hash: hash,
        nonce: nonce,
        transaction: transactions.getPendings()
    };

    transactions.clearAll();
    this.chain.push(newBlock);

    return newBlock;
};

Blockchain.prototype.proofOfWork = function() {
    let lastblock = this.getLastBlock();
    let previousBlockHash = lastblock.hash;
    let currentBlockData = {
        index: this.chain.length,
        transactions: transactions.getPendings()
    };
    let nonce = 0;
    let hash;
    while(true){
        const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
        hash = sha256(dataAsString);
        if (hash.substring(0, this.difficulty) === Array(this.difficulty + 1).join('0')) {
            break;
        }
        nonce++;
    }
    return {
        nonce: nonce,
        hash: hash
    }
};

Blockchain.prototype.receive = function(newBlock, callback){
    const lastBlock = this.getLastBlock();

	if ((lastBlock.hash === newBlock.previousBlockHash) && (lastBlock['index'] + 1 === newBlock['index'])) {
		this.chain.push(newBlock);
        transactions.clearAll();
        callback(this);
	} else {
		callback(null, 'rejected');
	}
};

const blockchain = new Blockchain();
module.exports = blockchain;