const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const STORJ_ACCESS_KEY = process.env.STORJ_ACCESS_KEY;
const STORJ_SECRET_KEY = process.env.STORJ_SECRET_KEY;
const STORJ_ENDPOINT = process.env.STORJ_ENDPOINT;

const contract = require("../artifacts/contracts/HelloWorldFile.sol/HelloWorldFile.json");
const ethers = require('ethers');

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
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

// Example usage
const params = {
  Bucket: "demo-bucket",
  Key: "test_file.pdf",
  Body: fs.createReadStream(__dirname + '/Teste.pdf'),
};

async function uploadFile(params) {
  try {
    await client.send(new PutObjectCommand(params));
    console.log(`File uploaded successfully. ${params.Key}`);
    console.log("Updating in the blockchain...");
    const tx = await helloWorldContract.update(`${params.Key}`);
    await tx.wait();
    console.log(`Lastest file uploaded: ${params.Key}`);
  } catch (err) {
    console.error('Error uploading file:', err);
  }
}

uploadFile(params);