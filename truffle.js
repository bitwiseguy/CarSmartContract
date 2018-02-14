module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
networks: {
    development: {
      host: "127.0.0.1",
      port: 22001,
      network_id: "*", // Match any network id
      gasPrice: 0,
      gas: 99999999
    },
    node_2:  {
	host: "127.0.0.1",
	port: 22002,
	network_id: "*", // Match any network id
	gasPrice: 0,
	gas: 99999999
    },
    node_5:  {
	host: "127.0.0.1",
	port: 22005,
	network_id: "*", // Match any network id
	gasPrice: 0,
	gas: 99999999
    }
  }
};
