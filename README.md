# LicensedMediaOnBlockchain
Licensed Media distribution platform using Ethereum and Solidity.

Smart Contract for Media Distribution, tested by deployment on Ethereum Testnet.

# Features
- A "Creator" web interface, to allow a publisher to add information about their media to the blockchain.
- "Creator" web interface allows the creator to set price of media and its URL.
- Creator is allowed to provide several address that should receive payment and in what proportion.
- Consumer web interface lists all available media that they have not purchased and their prices.
- Consumer provides a public encryption key and pays for a media using ETH.
- The "Creator"'s interface uses the consumer's public key to encrypt the media URL and publish it to the blockchain.
- The consumer can now use private key to decrypt media URL and use it. This is done by the Consumer's web portal.
- Hence the contract provides **offchain encryption-decryption interface**.
