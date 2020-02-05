const CrowdFunding = artifacts.require("CrowdFunding");

module.exports = function(deployer) {
	const deadline = 1577775695;
	const goal = 6;
	deployer.deploy(CrowdFunding, deadline, goal);
};