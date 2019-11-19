pragma solidity ^0.5.0;

contract CrowdFunding{
	struct Backer{
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

	event Deposit(address _from, uint amount); 

	constructor(uint _deadline, uint _goal) public {
		owner = msg.sender;
		numBacker = 0;
		deadline = _deadline;
		goal = _goal;
		campaignStatus = "Funding";
		amountRaised = 0;
		ended = false;
	}

	function fund() public payable{
		numBacker++;
		Backer memory _baker = backers[numBacker];
		_baker.addr = msg.sender;
		_baker.amount = msg.value;
		amountRaised += _baker.amount;
		owner.transfer(msg.value);
		emit Deposit(msg.sender, msg.value);
	}
}