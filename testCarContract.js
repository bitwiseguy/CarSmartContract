var CarContract = artifacts.require("CarContract");
var toKeys=["dWreo9NBaEsmM5yRVkR12VpkdnTWvxeT8NHk2BINbHA="];

contract('CarContract', function(accounts) {

 it("Should return Mitsubishi static info", function() {
    var instance;
    return CarContract.deployed().then(function(_instance) {
       instance = _instance;
       return instance.getStaticCarInfo.call("12345678901234567");
    }).then(function(_carInfo) {
       console.log('VIN: ' + _carInfo[0]);
       console.log('Car make: ' + _carInfo[1]);
       console.log('Car model: ' + _carInfo[2]);
       assert.equal(_carInfo[0], "12345678901234567", "Car VIN is wrong");
       assert.equal(_carInfo[1], "Mitsubishi", "Car make is wrong");
       assert.equal(_carInfo[2], "Galant ES, 2009", "Car model is wrong");
    });
 });
 it("Should return Mitsubishi owner info", function() {
    var instance2;
    return CarContract.deployed().then(function(_instance) {
       instance2 = _instance;
       return instance2.getAllIndexes.call("12345678901234567");
    }).then(function(_indexes) {
       return instance2.getOwner.call("12345678901234567", _indexes[0]);
    }).then(function(_ownerInfo) {
       console.log('Owner address: ' + _ownerInfo[0]);
       console.log('Time bought: ' + _ownerInfo[1]);
       console.log('Car Mileage: ' + _ownerInfo[2]);
       console.log('Account 0: ' + accounts[0]);
       console.log('Account 1: ' + accounts[1]);
       console.log('Account 2: ' + accounts[2]);
       console.log('Account 3: ' + accounts[3]);
       console.log('Account 4: ' + accounts[4]);
       assert.equal(_ownerInfo[0], accounts[0], "Car owner is wrong");
    });
 });
 it("Should set then get airbag info", function() {
    var instance3;
    return CarContract.deployed().then(function(_instance3) {
       instance3 = _instance3;
       return instance3.changeAirbag("12345678901234567", "AIRBAG6789", 0, "MANUFACTURER", {privateFor: toKeys});
    }).then(function() {
       console.log('    Airbag part added');
       return instance3.getAllIndexes.call("12345678901234567");
    }).then(function(_indexes) {
       return instance3.getAirbag.call("12345678901234567", _indexes[1]);
    }).then(function(_airbagInfo) {
       console.log('Airbag part number: ' + _airbagInfo[0]);
       console.log('Time installed: ' + _airbagInfo[1]);
       console.log('Car Mileage: ' + _airbagInfo[2]);
       console.log('Installer: ' + _airbagInfo[3]);
       assert.equal(_airbagInfo[0], "AIRBAG6789", "Airbag part number is wrong");
       assert.equal(_airbagInfo[2], 0, "Car mileage for airbag installation is wrong");
       assert.equal(_airbagInfo[3], "MANUFACTURER", "Airbag installer is wrong");
    });
 });
 it("Should reject part change from anyone who is not the car owner", function() {
    return CarContract.deployed().then(function(_instance3) {
       instance3 = _instance3;
       return instance3.changeAirbag("12345678901234567", "FAKEPART", "110333", "Hank Hammer, Meineke", {from: accounts[3], privateFor: toKeys});
    }).then(function(result) {
       console.log('    Airbag part added');
    }).catch(function(e) {
       //console.log(e);
       // An error was correctly detected.  CarContract should have rejected part change from unauthorized account
       return instance3.getAllIndexes.call("12345678901234567");
    }).then(function(_indexes) {
       return instance3.getAirbag.call("12345678901234567", _indexes[1]);
    }).then(function(_airbagInfo) {
       console.log('Airbag part number: ' + _airbagInfo[0]);
       console.log('Time installed: ' + _airbagInfo[1]);
       console.log('Car Mileage: ' + _airbagInfo[2]);
       console.log('Installer: ' + _airbagInfo[3]);
       // All airbag part info should be unchanged
       assert.equal(_airbagInfo[0], "AIRBAG6789", "Airbag part number change by unauthorized account");
       assert.equal(_airbagInfo[2], 0, "Car mileage changed by unauthorized account");
       assert.equal(_airbagInfo[3], "MANUFACTURER", "Airbag installer changed by unauthorized account");
    });
 });
 it("Add two installations of tires then report tire history", function() {
    var instance3;
    var i = 0;
    return CarContract.deployed().then(function(_instance3) {
       instance3 = _instance3;
       return instance3.changeTires("12345678901234567", "GOODYEAR3456", 0, "MANUFACTURER", {privateFor: toKeys});
    }).then(function() {
       console.log('    Tires added');
       return instance3.changeTires("12345678901234567", "MICHELIN3456", 55000, "Randy Wrench, AutoFix", {privateFor: toKeys});
    }).then(function() {
       console.log('    Tires added\n');
       return instance3.getAllIndexes.call("12345678901234567");
    }).then(function(_indexes) {
       console.log('-----Tire history-----');
       return instance3.getTires.call("12345678901234567", 0);
    }).then(function(_tireInfo) {
       console.log(i + ' Tire part number: ' + _tireInfo[0]);
       console.log(i + ' Time installed: ' + _tireInfo[1]);
       console.log(i + ' Car Mileage: ' + _tireInfo[2]);
       console.log(i + ' Installer: ' + _tireInfo[3] + '\n');
       i = 1;
       return instance3.getTires.call("12345678901234567", i);
    }).then(function(_tireInfo) {
       console.log(i + ' Tire part number: ' + _tireInfo[0]);
       console.log(i + ' Time installed: ' + _tireInfo[1]);
       console.log(i + ' Car Mileage: ' + _tireInfo[2]);
       console.log(i + ' Installer: ' + _tireInfo[3]);
       console.log('----------------------');
       assert.equal(_tireInfo[0], "MICHELIN3456", "Tire part number is wrong");
       assert.equal(_tireInfo[2], 55000, "Car mileage for tire installation is wrong");
       assert.equal(_tireInfo[3], "Randy Wrench, AutoFix", "Tire installer is wrong");
    });
 });
 it("Change ownership, disable previous owner's ability to make transactions", function() {
    var instance3;
    var numOwners;
    var numTires;
    var numTires2;
    return CarContract.deployed().then(function(_instance3) {
       instance3 = _instance3;
       return instance3.changeOwner("12345678901234567", accounts[3], "78000", {privateFor: toKeys});
    }).then(function() {
       console.log('Owner changed to: ' + accounts[3]);
       return instance3.getOwner.call("12345678901234567", 1, {from: accounts[3]});
    }).then(function(_ownerInfo) {
       console.log('Reported owner address: ' + _ownerInfo[0]);
       console.log('Reported time bought: ' + _ownerInfo[1]);
       console.log('Reported car Mileage: ' + _ownerInfo[2]);
       return instance3.getAllIndexes.call("12345678901234567", {from: accounts[3]});
    }).then(function(_indexes) {
       numOwners = Number(_indexes[0]) + 1;
       numTires = Number(_indexes[3]) + 1;
       console.log('Number of owners: ' + numOwners);
       console.log('Number of tire installations: ' + numTires);
       return instance3.changeTires("12345678901234567", "FAKETIRE3456", "80000", "Fake Mechanic, AutoFix", {privateFor: toKeys});
    }).then(function() {
       return instance3.getAllIndexes.call("12345678901234567", {from: accounts[3]});
    }).then(function(_indexes) {
       numTires2 = Number(_indexes[3]) + 1;
       console.log('Number of tire installations: ' + numTires2);    // Would report 3 if latest changeTires() call was allowed
       assert.equal(numTires, numTires2, "New tires logged by unauthorized account");
    });
 });
});
