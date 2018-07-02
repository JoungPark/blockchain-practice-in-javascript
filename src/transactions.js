const axios = require('axios');
const networkNode = require('../src/network');

function Transactions() {
    this.pendings = []
};

Transactions.prototype.getPendings = function() {
    return this.pendings;
};

Transactions.prototype.clear = function() {
    this.pendings = [];
};

Transactions.prototype.add = function(transaction){
    this.pendings.push(transaction);
    console.log('transactions: ' + this.pendings);
};

Transactions.prototype.register = function(transaction) {
    // 2 things => 1. broadcast, 2. reply all connected nodes
    const axiosPromises = [];
    networkNode.getInstance().networkNodeUrls.forEach(url => {
        console.log(url);
        axiosPromises.push(
            axios({
                method: 'post',
                url: url + '/transaction/add',
                data: {
                    transaction: transaction
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

    this.add(transaction);
}

const transactions = new Transactions();
module.exports = transactions;