const axios = require('axios');

function NetworkNode(thisNodeUrl) {
	this.thisNodeUrl = thisNodeUrl;
    this.networkNodeUrls = [];
};

NetworkNode.prototype.add = function(nodeUrl){
    this.networkNodeUrls.push(nodeUrl);
    console.log('nodes: ' + this.networkNodeUrls);
};

NetworkNode.prototype.addlist = function(nodeUrls){
    nodeUrls.forEach(url => {
        console.log(`try ${url}`);
        if (this.networkNodeUrls.indexOf(url) !== null) {
            console.log(`added ${url}`);
            this.networkNodeUrls.push(url);
            console.log(this.networkNodeUrls);
        }
    });
    console.log(this.networkNodeUrls);
};

NetworkNode.prototype.register = function(newNodeUrl) {
    // 2 things => 1. broadcast, 2. reply all connected nodes
    const axiosPromises = [];
    this.networkNodeUrls.forEach(url => {
        axiosPromises.push(
            axios({
                method: 'post',
                url: url + '/node/add',
                data: {
                    nodeUrl: newNodeUrl
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

    let nodeUrls = [...this.networkNodeUrls, this.thisNodeUrl];
    console.log(`addlist ${nodeUrls.length} to ${newNodeUrl}` )
    axios.post(newNodeUrl + '/node/addlist', {nodeUrls: nodeUrls})
    .then(function (res) {
        console.log('success');
    })
    .catch(function (err) {
        console.log(err);
    });;

    this.add(newNodeUrl);
}

let networkNode;

var createInstance = function(thisNodeUrl) {
    if (networkNode === undefined) {
        networkNode = new NetworkNode(thisNodeUrl);
    }
    return networkNode;
};
var getInstance = function() {
    return networkNode;
};

module.exports.getInstance = getInstance;
module.exports.createInstance = createInstance;
// module.exports = networkNode;
