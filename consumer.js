web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
abi = JSON.parse('[{"constant":true,"inputs":[],"name":"latestID","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"pendingReturns","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getMediaCount","outputs":[{"name":"_count","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isIndividual","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"purchasedMedia","outputs":[{"name":"id","type":"uint256"},{"name":"name","type":"bytes32"},{"name":"encURL","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"buyMedia","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_url","type":"string"},{"name":"_id","type":"uint256"},{"name":"buyer","type":"address"}],"name":"addEnctyptedURL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isCompany","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getPurchasedMediaDetails","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"allMedia","outputs":[{"name":"id","type":"uint256"},{"name":"creator","type":"address"},{"name":"name","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_stakeholders","type":"address[]"},{"name":"_costCompany","type":"uint256[]"},{"name":"_costIndividual","type":"uint256[]"}],"name":"createMedia","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_index","type":"uint256"}],"name":"getMediaAtIndex","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isCreator","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"mediaMap","outputs":[{"name":"id","type":"uint256"},{"name":"creator","type":"address"},{"name":"name","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"reason","type":"bytes32"},{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"mediaID","type":"uint256"}],"name":"PurchaseFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"mediaID","type":"uint256"},{"indexed":false,"name":"creator","type":"address"}],"name":"PaymentSuccessful","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"mediaID","type":"uint256"}],"name":"EncURLAdded","type":"event"}]');
MediaContract = web3.eth.contract(abi);
// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
contractInstance = MediaContract.at('0x330ca366ae63fac4ff104499a33674a3713990ac');

account = 6;

function publishMedia() {
  // candidateName = $("#candidate").val();
  // contractInstance.voteForCandidate(candidateName, {from: web3.eth.accounts[0]}, function() {
  //   let div_id = candidates[candidateName];
  //   $("#" + div_id).html(contractInstance.totalVotesFor.call(candidateName).toString());
  // });

  mediaName = $("#media-name").val();
  priceI = $("#price-ind").val();
  priceC = $("#price-com").val();
  stakeholders = $("#stake-addr").val();
  shares = $("#stake-share").val();
  stakeholdersList = stakeholders.split(', ');
  sharesList = shares.split(', ');
  console.log(stakeholdersList);
  console.log(sharesList);
  sharesListF = []
  sharesComF = []
  sharesIndF = []
  if(stakeholdersList.length != sharesList.length) return;

  sum = 0;
  sumC = 0;
  sumI = 0;
  for(i=0;i<sharesList.length;i++) {
    f = parseFloat(sharesList[i]);
    sharesListF.push(f);
    sum += parseFloat(sharesList[i]);
    sharesComF.push(parseInt(f * priceC));
    sumC += parseInt(f * priceC);
    sharesIndF.push(parseInt(f * priceI));
    sumI += parseInt(f * priceI);
  }
  if(sum != 1) {
    console.log("Shares do not sum to 1");
    return;
  }
  sharesComF[0] += (priceC - sumC);
  sharesIndF[0] += (priceI - sumI);
  console.log(sharesListF);
  console.log(sharesComF);
  console.log(sharesIndF);
  console.log("account: " + account);

// ['0xc0f512f7b2a9317719e42316595c88bdce0d4078', '0x227024f7f963f285be80adba309ace39fd7d106f']

  contractInstance.createMedia(mediaName, stakeholdersList , sharesComF, sharesIndF, 
    {from: web3.eth.accounts[account], gas:3000000});
}

function refreshPage() {
  populatePage();
}

function populatePage() {
  account = document.getElementById("account-number").value;

  console.log("refreshing from account: " + account);
  mediaCount = contractInstance.getMediaCount.call({from: web3.eth.accounts[$("#account-number").val()]});
  console.log("count: " + mediaCount.toString());
  document.getElementById("av-table-body").innerHTML = "";
  for(i=0;i<mediaCount;i++) {
    mediaInfo = contractInstance.getMediaAtIndex.call(i, {from: web3.eth.accounts[account]});
    console.log(mediaInfo);
    document.getElementById("av-table-body").innerHTML += "<tr>\
          <td>" + mediaInfo[2] + "</td>\
          <td>" + web3.toAscii(mediaInfo[0]) + "</td>\
          <td>" + mediaInfo[1] + "</td>\
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










