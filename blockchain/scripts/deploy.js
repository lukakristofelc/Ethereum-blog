

const deploy = async() => {
  const contractFactory = await ethers.getContractFactory("Blog");
  const contract = await contractFactory.deploy();
  await contract.deployed();

  console.log("Contract deployed to: ", contract.address);
}

const run = async() => {
  try {
    await deploy();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

run();


