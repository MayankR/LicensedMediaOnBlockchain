web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
abi = JSON.parse('[{"constant":true,"inputs":[],"name":"latestID","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"pendingReturns","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getMediaCount","outputs":[{"name":"_count","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isIndividual","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"purchasedMedia","outputs":[{"name":"id","type":"uint256"},{"name":"name","type":"bytes32"},{"name":"encURL","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getPurchasedMediaAtIndex","outputs":[{"name":"","type":"uint256"},{"name":"","type":"bytes32"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"buyMedia","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_url","type":"string"},{"name":"_id","type":"uint256"},{"name":"buyer","type":"address"}],"name":"addEnctyptedURL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isCompany","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getPurchasedMediaDetails","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPurchasedMediaCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"allMedia","outputs":[{"name":"id","type":"uint256"},{"name":"creator","type":"address"},{"name":"name","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_stakeholders","type":"address[]"},{"name":"_costCompany","type":"uint256[]"},{"name":"_costIndividual","type":"uint256[]"}],"name":"createMedia","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_index","type":"uint256"}],"name":"getMediaAtIndex","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isCreator","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"mediaMap","outputs":[{"name":"id","type":"uint256"},{"name":"creator","type":"address"},{"name":"name","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"reason","type":"bytes32"},{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"mediaID","type":"uint256"}],"name":"PurchaseFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"mediaID","type":"uint256"},{"indexed":false,"name":"creator","type":"address"}],"name":"PaymentSuccessful","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"mediaID","type":"uint256"}],"name":"EncURLAdded","type":"event"}]');
MediaContract = web3.eth.contract(abi);
// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
contractInstance = MediaContract.at('0x16b6be26d947ccff2d42400be678405a44c52b8a');

account = 6;

function buyMedia() {
  // candidateName = $("#candidate").val();
  // contractInstance.voteForCandidate(candidateName, {from: web3.eth.accounts[0]}, function() {
  //   let div_id = candidates[candidateName];
  //   $("#" + div_id).html(contractInstance.totalVotesFor.call(candidateName).toString());
  // });

  mediaIDStr = $("#media-id").val();
  mediaCostStr = $("#media-cost").val();
  mediaID = parseInt(mediaIDStr);
  mediaCost = parseInt(mediaCostStr);

  console.log("Attempting to buy " + mediaID + " using " + mediaCost + " wei");
  console.log("account: " + account);

  // contractInstance.createMedia(mediaName, stakeholdersList , sharesComF, sharesIndF, 
  //   {from: web3.eth.accounts[account], gas:3000000});

  contractInstance.buyMedia(mediaID, {from: web3.eth.accounts[account], value:mediaCost, gas:3000000});
}

function refreshPage() {
  populatePage();
}

function populatePage() {
  account = document.getElementById("account-number").value;

  console.log("refreshing from account: " + account);
  document.getElementById("av-table-body").innerHTML = "";
  mediaCount = contractInstance.getMediaCount.call({from: web3.eth.accounts[$("#account-number").val()]});
  console.log("count: " + mediaCount.toString());
  for(i=0;i<mediaCount;i++) {
    mediaInfo = contractInstance.getMediaAtIndex.call(i, {from: web3.eth.accounts[account]});
    console.log(mediaInfo);
    document.getElementById("av-table-body").innerHTML += "<tr>\
          <td>" + mediaInfo[2] + "</td>\
          <td>" + web3.toAscii(mediaInfo[0]) + "</td>\
          <td>" + mediaInfo[1] + "</td>\
        </tr>"
  }

  document.getElementById("pur-table-body").innerHTML = "";
  mediaCount = contractInstance.getPurchasedMediaCount.call({from: web3.eth.accounts[$("#account-number").val()]});
  console.log("purchased count: " + mediaCount.toString());
  for(i=0;i<mediaCount;i++) {
    mediaInfo = contractInstance.getPurchasedMediaAtIndex.call(i, {from: web3.eth.accounts[account]});
    console.log(mediaInfo);
    document.getElementById("pur-table-body").innerHTML += "<tr>\
          <td>" + mediaInfo[0] + "</td>\
          <td>" + web3.toAscii(mediaInfo[1]) + "</td>\
          <td>" + mediaInfo[2] + "</td>\
        </tr>"
  }
}

$(document).ready(function() {
  // candidateNames = Object.keys(candidates);
  // for (var i = 0; i < candidateNames.length; i++) {
  //   let name = candidateNames[i];
  //   let val = contractInstance.totalVotesFor.call(name).toString()
  //   $("#" + candidates[name]).html(val);
  // }

  document.getElementById("account-number").value = account;
  console.log("account number: " + $("#account-number").val());
  
  populatePage();
});










