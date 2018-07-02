const sha256 = require('sha256');
const transactions = require('./transactions')

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
    
    this.createNewBlock(nonce, previousBlockHash, hash);
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

    transactions.clear();
    this.chain.push(newBlock);
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

const blockchain = new Blockchain();
module.exports = blockchain;