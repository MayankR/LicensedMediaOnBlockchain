pragma solidity ^0.4.18;

// 0x1f01c52dc7c39d7fcf86cd1e877ad4bef7e862b5
contract MediaContract {

  struct Media {
    uint id;
    address creator;
    bytes32 name;
    address[] stakeholders;
    uint[] costCompany;
    uint[] costIndividual;
  }

  struct PurchasedMediaDetails {
    uint id;
    bytes32 name;
    string encURL;
    string pubKey;
  }

  Media[] public allMedia;
  uint public latestID;

  mapping(address => bool) public isCreator;
  mapping(address => bool) public isIndividual;
  mapping(address => bool) public isCompany;

  mapping(address => PurchasedMediaDetails[]) public purchasedMedia;
  mapping(uint => Media) public mediaMap;

  //Invalid payments
  mapping(address => uint) public pendingReturns;

  event PurchaseFailed(bytes32 reason, address buyer, uint mediaID);
  event PaymentSuccessful(address buyer, uint mediaID, address creator, string pubKey);
  event EncURLAdded(address buyer, uint mediaID);

  function MediaContract() public {
    latestID = 0;
  }

  function createMedia(bytes32 _name, address[] _stakeholders, 
  			uint[] _costCompany, uint[] _costIndividual) public returns (uint) {
  	// Make sure this is not individual or a company
  	require(!isIndividual[msg.sender]);
  	require(!isCompany[msg.sender]);

  	//Make sure the stakeholders and costs are valid
  	require(_stakeholders.length == _costCompany.length &&
  					_stakeholders.length == _costIndividual.length);

    latestID++;
  	Media memory newMedia = Media({id: latestID,
                            creator:msg.sender,
  													name: _name,
  													stakeholders : _stakeholders,
  													costCompany : _costCompany,
  													costIndividual : _costIndividual});

  	allMedia.push(newMedia);
    mediaMap[latestID] = newMedia;

  	isCreator[msg.sender] = true;

    return latestID;
  }

  function getMediaCount() public returns (uint _count) {
    require(!isCreator[msg.sender]);

    if(!(isIndividual[msg.sender] || isCompany[msg.sender])) {
      isIndividual[msg.sender] = true;
    }

    _count = 0;
    for(uint i=0;i<allMedia.length;i++) {
      bool alreadyPurchased = false;
      for(uint j=0;j<purchasedMedia[msg.sender].length;j++) {
        if(allMedia[i].id == purchasedMedia[msg.sender][j].id) {
          alreadyPurchased = true;
          break;
        }
      }
      if(alreadyPurchased) {
        continue;
      }
      _count = _count + 1;
    }
  }

  function getMediaAtIndex(uint _index) public returns (bytes32, uint, uint) {
  	require(!isCreator[msg.sender]);

  	if(!(isIndividual[msg.sender] || isCompany[msg.sender])) {
      isIndividual[msg.sender] = true;
  	}

    uint curI = 0;
  	for(uint i=0;i<allMedia.length;i++) {
      bool alreadyPurchased = false;
  		for(uint j=0;j<purchasedMedia[msg.sender].length;j++) {
        if(allMedia[i].id == purchasedMedia[msg.sender][j].id) {
          alreadyPurchased = true;
          break;
        }
  		}
      if(alreadyPurchased) {
        continue;
      }
      if(curI == _index) {
        if(isIndividual[msg.sender]) {
          uint priceI = 0;
          for(uint k;k<allMedia[i].costIndividual.length;k++) {
            priceI = priceI + allMedia[i].costIndividual[k];
          }
          return (allMedia[i].name, priceI, allMedia[i].id);
        } else {
          uint priceC = 0;
          for(uint l;l<allMedia[i].costCompany.length;l++) {
            priceC = priceC + allMedia[i].costCompany[l];
          }
          return (allMedia[i].name, priceC, allMedia[i].id);
        }
        
      }
      curI = curI + 1;
  	}

    return ("nan", 0, 0);
  }

  function buyMedia(uint _id, string _pubKey) public payable {
    require(!isCreator[msg.sender]);

    require(isIndividual[msg.sender] || isCompany[msg.sender]);

    for(uint i=0;i<allMedia.length;i++) {
      //Find the media
      if(allMedia[i].id == _id) {
        for(uint j=0;j<purchasedMedia[msg.sender].length;j++) {
          if(allMedia[i].id == purchasedMedia[msg.sender][j].id) {
            // pendingReturns[msg.sender] += msg.value;
            emit PurchaseFailed("boughtERR", msg.sender, _id);
            revert();
          }
        }

        // Get the cost of media
        uint cost = 0;
        if(isIndividual[msg.sender]) {
          for(uint k=0;k<allMedia[i].costIndividual.length;k++) {
            cost += allMedia[i].costIndividual[k];
          }
        } else {
          for(uint l=0;l<allMedia[i].costCompany.length;l++) {
            cost += allMedia[i].costCompany[l];
          }
        }

        // Check is correct amount paid
        if(msg.value != cost) {
          emit PurchaseFailed("amountERR", msg.sender, _id);
          revert();
        }

        //pay stakeholders
        if(isIndividual[msg.sender]) {
          for(uint m=0;m<allMedia[i].costIndividual.length;m++) {
            allMedia[i].stakeholders[m].transfer(allMedia[i].costIndividual[m]);
          }
        } else {
          for(uint n=0;n<allMedia[i].costCompany.length;n++) {
            allMedia[i].stakeholders[n].transfer(allMedia[i].costCompany[n]);
          }
        }

        PurchasedMediaDetails memory newMediaP = PurchasedMediaDetails({id: _id, 
        name: mediaMap[_id].name, encURL: "Not Available", pubKey: _pubKey});
        purchasedMedia[msg.sender].push(newMediaP);

        emit PaymentSuccessful(msg.sender, _id, allMedia[i].creator, _pubKey);
        return;
      }

    }
  }

  function addEnctyptedURL(string _url, uint _id, address buyer) public {
    require(mediaMap[_id].creator == msg.sender);

    for(uint i=0;i<purchasedMedia[buyer].length;i++) {
      if(purchasedMedia[buyer][i].id == _id) {
        purchasedMedia[buyer][i].encURL = _url;
        emit EncURLAdded(buyer, _id);
        return;
      }
    }
    
  }

  function getPurchasedMediaCount() public view returns (uint) {
    require(isCompany[msg.sender] || isIndividual[msg.sender]);

    return purchasedMedia[msg.sender].length;
  }

  function getPurchasedMediaAtIndex(uint index) public view returns (uint, bytes32, string) {
    require(isCompany[msg.sender] || isIndividual[msg.sender]);

    require(index < purchasedMedia[msg.sender].length);

    return (purchasedMedia[msg.sender][index].id, 
      purchasedMedia[msg.sender][index].name, purchasedMedia[msg.sender][index].encURL);
  }

  function getPurchasedMediaDetails(uint _id) public view returns (string) {
    require(isCompany[msg.sender] || isIndividual[msg.sender]);

    for(uint i=0;i<purchasedMedia[msg.sender].length;i++) {
      if(purchasedMedia[msg.sender][i].id == _id) {
        return purchasedMedia[msg.sender][i].encURL;
      }
    }

    return "ERR";
  }
}