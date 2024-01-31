const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const contract = require("../artifacts/contracts/HelloWorldFile.sol/HelloWorldFile.json");

const ethers = require('ethers');

// Provider
const alchemyProvider = new ethers.providers.JsonRpcProvider(API_URL);

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// Contract
const helloWorldContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

console.log(JSON.stringify(contract.abi));

async function main() {
  const message = await helloWorldContract.message();
  console.log("The message is: " + message);
}

console.log(API_URL)
//main();
