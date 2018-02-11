// File: `./migrations/4_deploy_carcontract.js` 

var CarContract = artifacts.require("CarContract");
var toKeys=["dWreo9NBaEsmM5yRVkR12VpkdnTWvxeT8NHk2BINbHA="];    // Node2's Constellation public key found in tm.pub

module.exports = function(deployer, network, accounts) {
    // Pass VIN, carMake, and carModel to the contract as the first constructor parameters
    // Private contract between default node (Node1) and Node2
    deployer.deploy(CarContract, "12345678901234567", "Mitsubishi", "Galant ES, 2009", {privateFor: toKeys})
    //deployer.deploy(CarContract, "12345678901234567", "Mitsubishi", "Galant ES, 2009", {privateFor: ["7Vpvnkl8/szYNDtvlksHmhskg2e42yTIZ/Na0Et38Hk="]})
    //deployer.deploy(CarContract, "12345678901234567", "Mitsubishi", "Galant ES, 2009")
};

//const Web3 = require('web3');
//
//const TruffleConfig = require('../truffle');
//
//var CarContract = artifacts.require("CarContract");
//
//
//module.exports = function(deployer, network, accounts) {
//    const config = TruffleConfig.networks[network];
//
//    if (process.env.ACCOUNT_PASSWORD) {
//        const web3 = new Web3(new Web3.providers.HttpProvider('http://' + config.host + ':' + config.port));
//        console.log('>> Unlocking account ' + config.from);
//        web3.personal.unlockAccount("5dada6be7eb51ee3eac1232334aa3c9d60d7b0d2", "a431723f77c6e90156560ed133cbffceac352f4e5ca44c708ca1d88406d1da44", 0);
//    }
//
//    console.log('>> Deploying migration');
//    deployer.deploy(CarContract, "12345678901234567", "Mitsubishi", "Galant ES, 2009");
//
//};
