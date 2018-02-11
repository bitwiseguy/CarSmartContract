pragma solidity ^0.4.17;
/// @title Automobile data storage


contract CarContract {

    struct PartInfo {
        string part;
        uint timeInstalled;
        uint carMileage;
        string whoInstalledPart;
    }

    struct OwnerInfo {
        address ownerAddress;
        uint timeBought;
        uint carMileage;
    }

    struct CarStruct {
	uint8 counterOwner;    // Current owner array position
	uint8 counterAirbag;   // Current airbag array position
	uint8 counterEngine;   // Current engine array position
	uint8 counterTires;    // Current tires array position
        uint64 vin;            // VINs are 17 digits long. This will never change
        string carMake;        // This will never change
        string carModel;       // This will never change
        PartInfo[50] airbag;
        PartInfo[50] engine;
        PartInfo[100] tires;
        OwnerInfo[100] ownerHistory;
    }
    
    // Automobiles added to the registry
    // Creates a CarStruct for every possible VIN
    mapping (uint64 => CarStruct) automobiles;
    
    // This is the constructor whose code is only run when the contract is first created
    function CarContract(uint64 vin_, string newCarMake, string newCarModel) public {
        automobiles[vin_].vin = vin_;
        automobiles[vin_].carMake = newCarMake;
        automobiles[vin_].carModel = newCarModel;
        automobiles[vin_].ownerHistory[0].ownerAddress = msg.sender;
        automobiles[vin_].ownerHistory[0].timeBought = now;
        automobiles[vin_].ownerHistory[0].carMileage = 0;
    }
   
    function getAllIndexes(uint64 vin_) public view returns (uint8 ownerIndex, uint8 airbagIndex_,
                                                             uint8 engineIndex_, uint8 tiresIndex) {
        var currentCar = automobiles[vin_];
        return (currentCar.counterOwner, currentCar.counterAirbag, currentCar.counterEngine, currentCar.counterTires);
    }

    function getStaticCarInfo(uint64 vin_) public view returns (uint64 vinOut, string _carMake, string _carModel) {
        return (automobiles[vin_].vin, automobiles[vin_].carMake, automobiles[vin_].carModel);
    }
 
    function getAirbag(uint64 vin_, uint8 arrayIndex_) public view returns (string _part, uint _timeInstalled,
                                                                uint _carMileage, string _whoInstalledPart) {
        var currentCar = automobiles[vin_];
	var counterOwner_ = currentCar.counterOwner;
        assert(msg.sender == currentCar.ownerHistory[counterOwner_].ownerAddress);
        return (currentCar.airbag[arrayIndex_].part,
                currentCar.airbag[arrayIndex_].timeInstalled,
                currentCar.airbag[arrayIndex_].carMileage,
                currentCar.airbag[arrayIndex_].whoInstalledPart);
    }
    
    function getEngine(uint64 vin_, uint8 arrayIndex_) public view returns (string _part, uint _timeInstalled,
                                                                uint _carMileage, string _whoInstalledPart) {
        var currentCar = automobiles[vin_];
	var counterOwner_ = currentCar.counterOwner;
        assert(msg.sender == currentCar.ownerHistory[counterOwner_].ownerAddress);
        return (currentCar.engine[arrayIndex_].part,
                currentCar.engine[arrayIndex_].timeInstalled,
                currentCar.engine[arrayIndex_].carMileage,
                currentCar.engine[arrayIndex_].whoInstalledPart);
    }

    function getTires(uint64 vin_, uint8 arrayIndex_) public view returns (string _part, uint _timeInstalled,
                                                                uint _carMileage, string _whoInstalledPart) {
        var currentCar = automobiles[vin_];
	var counterOwner_ = currentCar.counterOwner;
        assert(msg.sender == currentCar.ownerHistory[counterOwner_].ownerAddress);
        return (currentCar.tires[arrayIndex_].part,
                currentCar.tires[arrayIndex_].timeInstalled,
                currentCar.tires[arrayIndex_].carMileage,
                currentCar.tires[arrayIndex_].whoInstalledPart);
    }

    function getOwner(uint64 vin_, uint8 arrayIndex_) public view returns (address _ownerAddress, uint _timeBought, uint _carMileage) {
        var currentCar = automobiles[vin_];
	var counterOwner_ = currentCar.counterOwner;
        assert(msg.sender == currentCar.ownerHistory[counterOwner_].ownerAddress);
        return (currentCar.ownerHistory[arrayIndex_].ownerAddress,
                currentCar.ownerHistory[arrayIndex_].timeBought,
                currentCar.ownerHistory[arrayIndex_].carMileage);
    }

    function changeOwner(uint64 vin_, address newOwner, uint currentMileage) public {
        // Current owner is only one that can make a part change
        // assert verifies current owner is the person making the part change request
        var currentCar = automobiles[vin_];
	var counterOwner_ = currentCar.counterOwner;
        assert(msg.sender == currentCar.ownerHistory[counterOwner_].ownerAddress);
        currentCar.counterOwner++;
	counterOwner_ = currentCar.counterOwner;
        currentCar.ownerHistory[counterOwner_].ownerAddress = newOwner;
        currentCar.ownerHistory[counterOwner_].timeBought = now;
        currentCar.ownerHistory[counterOwner_].carMileage = currentMileage;
    }
    
    function changeAirbag (uint64 vin_, string newAirbag, uint currentMileage, string newMechanic) public {
        // Current owner is only one that can make a part change
        // assert verifies current owner is the person making the part change request
        var currentCar = automobiles[vin_];
	var counterOwner_ = currentCar.counterOwner;
        assert(msg.sender == currentCar.ownerHistory[counterOwner_].ownerAddress);
        if (bytes(currentCar.airbag[0].part).length > 0) {
            // If first airbag has been logged, move to next spot in array
            currentCar.counterAirbag++;
        }
	var counterAirbag_ = currentCar.counterAirbag;
        currentCar.airbag[counterAirbag_].part = newAirbag;
        currentCar.airbag[counterAirbag_].timeInstalled = now;
        currentCar.airbag[counterAirbag_].carMileage = currentMileage;
        currentCar.airbag[counterAirbag_].whoInstalledPart = newMechanic;
    }
    
    function changeEngine (uint64 vin_, string newEngine, uint currentMileage, string newMechanic) public {
        // Current owner is only one that can make a part change
        // assert verifies current owner is the person making the part change request
        var currentCar = automobiles[vin_];
	var counterOwner_ = currentCar.counterOwner;
        assert(msg.sender == currentCar.ownerHistory[counterOwner_].ownerAddress);
        if (bytes(currentCar.engine[0].part).length > 0) {
            // If first engine has been logged, move to next spot in array
            currentCar.counterEngine++;
        }
	var counterEngine_ = currentCar.counterEngine;
        currentCar.engine[counterEngine_].part = newEngine;
        currentCar.engine[counterEngine_].timeInstalled = now;
        currentCar.engine[counterEngine_].carMileage = currentMileage;
        currentCar.engine[counterEngine_].whoInstalledPart = newMechanic;    
    }
    
    function changeTires (uint64 vin_, string newTires, uint currentMileage, string newMechanic) public {
        // Current owner is only one that can make a part change
        // assert verifies current owner is the person making the part change request
        var currentCar = automobiles[vin_];
	var counterOwner_ = currentCar.counterOwner;
        assert(msg.sender == currentCar.ownerHistory[counterOwner_].ownerAddress);
        if (bytes(currentCar.tires[0].part).length > 0) {
            // If first set of tires have been logged, move to next spot in array
            currentCar.counterTires++;
        }
	var counterTires_ = currentCar.counterTires;
        currentCar.tires[counterTires_].part = newTires;
        currentCar.tires[counterTires_].timeInstalled = now;
        currentCar.tires[counterTires_].carMileage = currentMileage;
        currentCar.tires[counterTires_].whoInstalledPart = newMechanic;  
    }
}
