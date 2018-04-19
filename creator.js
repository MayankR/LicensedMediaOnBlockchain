web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
abi = JSON.parse('[{"constant":true,"inputs":[],"name":"latestID","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"pendingReturns","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_pubKey","type":"string"}],"name":"buyMedia","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getMediaCount","outputs":[{"name":"_count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isIndividual","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"purchasedMedia","outputs":[{"name":"id","type":"uint256"},{"name":"name","type":"bytes32"},{"name":"encURL","type":"string"},{"name":"pubKey","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getPurchasedMediaAtIndex","outputs":[{"name":"","type":"uint256"},{"name":"","type":"bytes32"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_url","type":"string"},{"name":"_id","type":"uint256"},{"name":"buyer","type":"address"}],"name":"addEnctyptedURL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isCompany","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getPurchasedMediaDetails","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPurchasedMediaCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"allMedia","outputs":[{"name":"id","type":"uint256"},{"name":"creator","type":"address"},{"name":"name","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_stakeholders","type":"address[]"},{"name":"_costCompany","type":"uint256[]"},{"name":"_costIndividual","type":"uint256[]"}],"name":"createMedia","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getMediaAtIndex","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isCreator","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"mediaMap","outputs":[{"name":"id","type":"uint256"},{"name":"creator","type":"address"},{"name":"name","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"users","type":"address[]"},{"name":"userType","type":"uint256[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"reason","type":"bytes32"},{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"mediaID","type":"uint256"}],"name":"PurchaseFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"mediaID","type":"uint256"},{"indexed":false,"name":"creator","type":"address"},{"indexed":false,"name":"pubKey","type":"string"}],"name":"PaymentSuccessful","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"mediaID","type":"uint256"}],"name":"EncURLAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"creator","type":"address"},{"indexed":false,"name":"mediaID","type":"uint256"}],"name":"MediaCreated","type":"event"}]');
MediaContract = web3.eth.contract(abi);
// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
contractInstance = MediaContract.at('0x30eec117479f47c13719002ff4b1ea40036ff6e9');

account = 1;

var paymentSuccessfulEvent = contractInstance.PaymentSuccessful();
paymentSuccessfulEvent.watch(function(error, result){
    if (!error)
    {
      // $("#instructor").html(result.args.name + ' (' + result.args.age + ' years old)');
      console.log(web3.eth.accounts[account]);
      console.log(result.args["creator"])
      if(web3.eth.accounts[account] == result.args["creator"] &&
         document.getElementById("media-id-hidden").value == result.args["mediaID"]) {
        console.log("i am creator ");
        console.log(result.args["pubKey"]);
        var encrypted = encryptMedia(result.args["pubKey"], $('#media-url').val());

        console.log("encrypted " + $('#media-url').val() + " to " + encrypted);
        console.log("buyer: " + result.args["buyer"]);
        contractInstance.addEnctyptedURL(encrypted, result.args["mediaID"] , result.args["buyer"], 
          {from: web3.eth.accounts[account], gas:3000000});
      }
    } else {
      console.log("err" + error);
    }
});


var mediaCreatedEvent = contractInstance.MediaCreated();
mediaCreatedEvent.watch(function(error, result){
    if (!error)
    {
      console.log("got event");
      console.log($("#media-name").val());
      console.log(web3.toAscii(result.args["name"]));
      medstr = web3.toAscii(result.args["name"]);
      console.log(medstr.indexOf('\0'));
      if($("#media-name").val() == medstr.substring(0, medstr.indexOf('\0')) &&
          result.args["creator"] == web3.eth.accounts[account]) {
        console.log("success create");
        document.getElementById("success-msg").innerHTML = "Successfully Created!<br> Media ID: " + result.args["mediaID"];
        document.getElementById("media-url").disabled = true;
        document.getElementById("media-id-hidden").value = result.args["mediaID"];
      }
    } else {
      console.log("err" + error);
    }
});

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
    sharesComF.push(web3.toWei("" + (f * priceC), 'ether'));
    sumC += parseInt(web3.toWei("" + (f * priceC), 'ether'));
    sharesIndF.push(web3.toWei("" + (f * priceI), 'ether'));
    sumI += parseInt(web3.toWei("" + (f * priceI), 'ether'));
  }
  if(sum != 1) {
    console.log("Shares do not sum to 1");
    return;
  }
  // sharesComF[0] += (priceC - sumC);
  // sharesIndF[0] += (priceI - sumI);
  console.log(sharesListF);
  console.log(sharesComF);
  console.log(sharesIndF);
  console.log("account: " + account);

// ['0xc0f512f7b2a9317719e42316595c88bdce0d4078', '0x227024f7f963f285be80adba309ace39fd7d106f']

  mediaID = contractInstance.createMedia(mediaName, stakeholdersList , sharesComF, sharesIndF, 
    {from: web3.eth.accounts[account], gas:3000000}, function(err, res){
      console.log("created stuff");
      console.log(res);
    });

  
  console.log("tx: " + mediaID);
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
});