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
    // let currentBlockData = {
    //     index: this.chain.length,
    //     transactions: transactions.getPendings()
    // };
    const index = this.chain.length;

    let nonce = 0;
    let hash;
    while(true){
        // const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
        // hash = sha256(dataAsString);
        hash = getHash(previousBlockHash, nonce, index, transactions.getPendings());
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

getHash = function(previousBlockHash, nonce, index, transactions) {
    let currentBlockData = {
        index: index,
        transactions: transactions
    };
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    return sha256(dataAsString);
};

isValidBlockChain = function(chain) {
    for(let i = 1; i < chain.length; i++) {
        const prevBlock = chain[i-1];
        const currBlock = chain[i];
        if (prevBlock.hash !== currBlock.previousBlockHash) {
            return false;
        }
        const hash = getHash(currBlock.previousBlockHash, currBlock.nonce, currBlock.index, currBlock.transaction.getPendings());
        if (hash !== currBlock.hash) {
            return false;
        }
    }
    return true;
};

Blockchain.prototype.consensus = function() {
    const axiosPromises = [];
    networkNode.getInstance().networkNodeUrls.forEach(url => {
        axiosPromises.push(
            axios({
                method: 'get',
                url: url + '/blockchain'
            })
        );
    });
    Promise.all(axiosPromises)
    .then(responces => {
        responces.forEach(res =>{
            console.log(res.data);
            otherNodeChain = res.data;
            console.log(`${this.chain.length} , ${otherNodeChain.chain.length}`);
            if(this.chain.length > otherNodeChain.chain.length){
                return;
            }
            if (isValidBlockChain(otherNodeChain) === true) {
                this.chain = otherNodeChain.chain;
            }
        });
    })
    .catch(function (err) {
        // console.log(err);
    });
};

const blockchain = new Blockchain();
module.exports = blockchain;