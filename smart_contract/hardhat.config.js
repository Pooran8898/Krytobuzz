//https://eth-ropsten.alchemyapi.io/v2/4I71L0m-2NptcRk4bDD7bh98NuN6I6gW


require("@nomiclabs/hardhat-waffle")

module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/4I71L0m-2NptcRk4bDD7bh98NuN6I6gW",
      accounts: ["de54794d110fffb8ad6083efae255ce7be3f635bf238bd74f0476207b8e9cc59"]
    }
  }
}