const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const STORJ_ACCESS_KEY = process.env.STORJ_ACCESS_KEY;
const STORJ_SECRET_KEY = process.env.STORJ_SECRET_KEY;
const STORJ_ENDPOINT = process.env.STORJ_ENDPOINT;

const contract = require("../artifacts/contracts/HelloWorldFile.sol/HelloWorldFile.json");
const ethers = require('ethers');

const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');

// Provider
const alchemyProvider = new ethers.providers.JsonRpcProvider(API_URL);

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// Contract
const helloWorldContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

const client = new S3Client({
  credentials: {
    accessKeyId: STORJ_ACCESS_KEY,
    secretAccessKey: STORJ_SECRET_KEY,
  },
  endpoint: STORJ_ENDPOINT
});

async function main() {
  const file = await helloWorldContract.message();
  console.log("The lastest uploaded document was: " + file); 

  const command = new GetObjectCommand({
    Bucket: "demo-bucket",
    Key: file,
  });

  try {
    const response = await client.send(command);
    const str = await response.Body.transformToString();
    console.log(str);
  } catch (err) {
    console.error(err);
  }
};

main();