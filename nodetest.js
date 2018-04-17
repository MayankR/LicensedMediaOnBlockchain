const ecies = require("eth-ecies");
const ethutil = require('ethereumjs-util')
const Wallet = require('ethereumjs-wallet');

const publicKey = 'e0d262b939cd0267cfbe3f004e2863d41d1f631ce33701a8920ba73925189f5d15be92cea3c58987aa47ca70216182ba6bd89026fc15edfe2092a66f59a14003';
const privateKey = '55bb4cb6407303de8e4c5a635021d3db12cb537305eeb6401612ce14b35d6690';
const data = '{foo:"bar",baz:42}';

function encryptMedia(publicKey, data) {
	let userPublicKey = new Buffer(publicKey, 'hex');
	let bufferData = new Buffer(data);

	let encryptedData = ecies.encrypt(userPublicKey, bufferData);

	return encryptedData.toString('base64')
}

function decryptMedia(privateKey, encryptedData) {
	let userPrivateKey = new Buffer(privateKey, 'hex');
	let bufferEncryptedData = new Buffer(encryptedData, 'base64');

	let decryptedData = ecies.decrypt(userPrivateKey, bufferEncryptedData);

	return decryptedData.toString('utf8');
}

function privToPublicKey(privateKey) {
	return Buffer.from(ethutil.privateToPublic(privateKey)).toString('hex');
	//console.log("" + ethutil.privateToPublic(0xbd4a1f087abe8d012e2938618f906d95a7115471b35c06600aef27c64a0a1f9e));
}

function privToPublicKeyWallet(privateKey) {
    return Wallet.fromPrivateKey(Buffer.from(privateKey, 'hex')).getPublicKeyString().substring(2);
    //console.log("" + ethutil.privateToPublic(0xbd4a1f087abe8d012e2938618f906d95a7115471b35c06600aef27c64a0a1f9e));
}


//const pubK = Buffer.from(ethutil.privateToPublic(0x55bb4cb6407303de8e4c5a635021d3db12cb537305eeb6401612ce14b35d6690)).toString('hex');
const pubK = privToPublicKeyWallet('55bb4cb6407303de8e4c5a635021d3db12cb537305eeb6401612ce14b35d6690');
console.log(privToPublicKeyWallet('55bb4cb6407303de8e4c5a635021d3db12cb537305eeb6401612ce14b35d6690'));

console.log(decryptMedia('55bb4cb6407303de8e4c5a635021d3db12cb537305eeb6401612ce14b35d6690', encryptMedia(pubK, 'yothisisencrypt')));
