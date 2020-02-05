pragma solidity ^0.5.0;

contract CrowdFunding{
	struct Backer{
		uint id;
		string name;
		address payable addr;
		uint amount;
	}

	address payable public owner;
	uint public numBacker;
	uint public deadline;
	string public campaignStatus;
	bool ended;
	uint public goal;
	uint public amountRaised;
	mapping (uint => Backer) backers;

	event Deposit(uint id, string name, address _from, uint amount);
	event Refund(uint id, string name, address backer, uint amount);

	constructor(uint _deadline, uint _goal) public {
		owner = msg.sender;
		numBacker = 0;
		deadline = _deadline;
		goal = _goal;
		campaignStatus = "Funding";
		amountRaised = 0;
		ended = false;
	}

	function fund(string memory _name) public payable{
		//Require a valid name
		require(bytes(_name).length > 0);
		//Increment number of Backers
		numBacker++;
		//Create the backer
		backers[numBacker] = Backer(numBacker, _name, msg.sender, msg.value);
		//Add the amount to raised amount	
		amountRaised += msg.value;
		//send amount from backer to owner
		owner.transfer(msg.value);
		//triggre an event
		emit Deposit(numBacker, _name, msg.sender, msg.value);
	}

	function checkGoalReached() public returns (bool) {
		//Check if Campaign ended
		require(!ended);
		require(block.timestamp < deadline);

		if(amountRaised >= goal) {
			campaignStatus = "Campaign Succeeded";
			ended = true;			
		} else {
			campaignStatus = "Campaign failed";
			for(uint i = 1; i <= numBacker; i++){
				backers[i].addr.transfer(backers[i].amount);
				emit Refund(backers[i].id, backers[i].name, backers[i].addr, backers[i].amount);
			}
			ended = true;
		}
	}
}