const ecies = require("eth-ecies");
const Wallet = require('ethereumjs-wallet');

const publicKey = 'e0d262b939cd0267cfbe3f004e2863d41d1f631ce33701a8920ba73925189f5d15be92cea3c58987aa47ca70216182ba6bd89026fc15edfe2092a66f59a14003';
const privateKey = '55bb4cb6407303de8e4c5a635021d3db12cb537305eeb6401612ce14b35d6690';
const data = '{foo:"bar",baz:42}';

window.encryptMedia = function(publicKey, data) {
	let userPublicKey = new Buffer(publicKey, 'hex');
	let bufferData = new Buffer(data);

	let encryptedData = ecies.encrypt(userPublicKey, bufferData);

	return encryptedData.toString('base64')
}

window.decryptMedia = function(privateKey, encryptedData) {
	let userPrivateKey = new Buffer(privateKey, 'hex');
	let bufferEncryptedData = new Buffer(encryptedData, 'base64');

	let decryptedData = ecies.decrypt(userPrivateKey, bufferEncryptedData);

	return decryptedData.toString('utf8');
}

window.privToPublicKeyWallet = function(privateKey) {
    return Wallet.fromPrivateKey(Buffer.from(privateKey, 'hex')).getPublicKeyString().substring(2);
}


//const pubK = privToPublicKeyWallet('55bb4cb6407303de8e4c5a635021d3db12cb537305eeb6401612ce14b35d6690');
//console.log(privToPublicKeyWallet('55bb4cb6407303de8e4c5a635021d3db12cb537305eeb6401612ce14b35d6690'));

//console.log(decryptMedia('55bb4cb6407303de8e4c5a635021d3db12cb537305eeb6401612ce14b35d6690', encryptMedia(pubK, 'yothisisencrypt')));
