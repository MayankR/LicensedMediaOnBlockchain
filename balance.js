web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
abi = JSON.parse('[{"constant":true,"inputs":[],"name":"latestID","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"pendingReturns","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_pubKey","type":"string"}],"name":"buyMedia","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getMediaCount","outputs":[{"name":"_count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isIndividual","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"purchasedMedia","outputs":[{"name":"id","type":"uint256"},{"name":"name","type":"bytes32"},{"name":"encURL","type":"string"},{"name":"pubKey","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getPurchasedMediaAtIndex","outputs":[{"name":"","type":"uint256"},{"name":"","type":"bytes32"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_url","type":"string"},{"name":"_id","type":"uint256"},{"name":"buyer","type":"address"}],"name":"addEnctyptedURL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isCompany","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getPurchasedMediaDetails","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPurchasedMediaCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"allMedia","outputs":[{"name":"id","type":"uint256"},{"name":"creator","type":"address"},{"name":"name","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_stakeholders","type":"address[]"},{"name":"_costCompany","type":"uint256[]"},{"name":"_costIndividual","type":"uint256[]"}],"name":"createMedia","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getMediaAtIndex","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isCreator","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"mediaMap","outputs":[{"name":"id","type":"uint256"},{"name":"creator","type":"address"},{"name":"name","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"users","type":"address[]"},{"name":"userType","type":"uint256[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"reason","type":"bytes32"},{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"mediaID","type":"uint256"}],"name":"PurchaseFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"mediaID","type":"uint256"},{"indexed":false,"name":"creator","type":"address"},{"indexed":false,"name":"pubKey","type":"string"}],"name":"PaymentSuccessful","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"mediaID","type":"uint256"}],"name":"EncURLAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"creator","type":"address"},{"indexed":false,"name":"mediaID","type":"uint256"}],"name":"MediaCreated","type":"event"}]');
MediaContract = web3.eth.contract(abi);
// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
contractInstance = MediaContract.at('0xc0c40fe0c8ea13bfc4e9996165a7d81c22c36437');

account = 6;

// var paymentSuccessfulEvent = contractInstance.PaymentSuccessful();
// paymentSuccessfulEvent.watch(function(error, result){
//     if (!error)
//     {
//       // $("#instructor").html(result.args.name + ' (' + result.args.age + ' years old)');
//       console.log("res " + result);
//       console.log(result.args);
//       populatePage();
//     } else {
//       console.log("err" + error);
//     }
// });

// var encURLAddedEvent = contractInstance.EncURLAdded();
// encURLAddedEvent.watch(function(error, result){
//     if (!error)
//     {
//       // $("#instructor").html(result.args.name + ' (' + result.args.age + ' years old)');
//       console.log("res " + result);
//       console.log(result.args);
//       populatePage();
//     } else {
//       console.log("err" + error);
//     }
// });


function refreshPage() {
  account = document.getElementById("account-number").value;
  console.log("balance: " + web3.eth.getBalance(web3.eth.accounts[account]));
  document.getElementById("table-body").innerHTML = "<tr>\
          <td>" + account + "</td>\
          <td>" + web3.eth.getBalance(web3.eth.accounts[account]) + "</td>\
          <td>" + web3.eth.accounts[account] + "</td>\
        </tr>" + document.getElementById("table-body").innerHTML;
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
  
  refreshPage();
});










