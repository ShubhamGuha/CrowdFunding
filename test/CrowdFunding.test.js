const CrowdFunding = artifacts.require('./CrowdFunding.sol')

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('CrowdFunding',([owner, backer]) => {
	before( async () => {
		this.crowdfunding = await CrowdFunding.deployed()
	})

	describe('Deployment', async () => {
		it('Deployed Successfully!', async() => {
			const address = await this.crowdfunding.address
			assert.notEqual(address, 0x0)
			assert.notEqual(address, '')
			assert.notEqual(address, null)
			assert.notEqual(address, undefined) 		
		})

		it('Has Owner, Goal and DeadLine', async () => {
			_owner = await this.crowdfunding.owner()
			_goal = await this.crowdfunding.goal()
			_deadline = await this.crowdfunding.deadline()
			_numBacker = await this.crowdfunding.numBacker()
			_amountRaised = await this.crowdfunding.amountRaised()
			assert.equal(_owner, owner, 'Owner account exists.')
			assert.equal(_goal.toNumber(), 6, 'goal is correct')
			assert.equal(_deadline.toNumber(), 1577775695, 'DeadLine is correct')
			assert.equal(_numBacker.toNumber(), 0, 'Number of Backers are correct')
			assert.equal(_amountRaised.toNumber(), 0, 'Amount raised is correct')
		})	
	})

	describe('Funding', async () => {

		it('Check Owner Balance', async() => {
			//Check owner balance before funding
			let ownerBalanceBefore
			ownerBalanceBefore = await web3.eth.getBalance(owner)
			ownerBalanceBefore = new web3.utils.BN(ownerBalanceBefore)	
			result = await this.crowdfunding.fund('Ram', {from: backer, value: web3.utils.toWei('1', 'Ether')})
			_numBacker = await this.crowdfunding.numBacker()		

			//Success: Backer deposite fund			
			const event = result.logs[0].args
			assert.equal(event.id.toNumber(), _numBacker.toNumber(), 'ID is correct')
			assert.equal(event.name, 'Ram', 'name is correct')
			assert.equal(event.amount, '1000000000000000000', 'Amount is correct')
			assert.equal(event._from, backer, 'Backer has deposited')

			//Check owner balance after funding
			let ownerBalanceAfter
			ownerBalanceAfter = await web3.eth.getBalance(owner)
			ownerBalanceAfter = new web3.utils.BN(ownerBalanceAfter)

			let price
			price = web3.utils.toWei('1', 'Ether')
			price = new web3.utils.BN(price)

			const expectedBalance = ownerBalanceBefore.add(price)

			assert.equal(ownerBalanceAfter.toString(), expectedBalance.toString())

			//FAILURE: Backer must have a name
			await this.crowdfunding.fund('', {from: backer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
		})
		
		
		it('Check Goal status', async() => {	
			_campaignStatus = await this.crowdfunding.campaignStatus()	
			console.log(_campaignStatus)		
			if(_campaignStatus == "Campaign Succeeded")	
				{
					assert.equal(_campaignStatus,"Campaign Succeeded","Campaign Succeeded")
				}
			else if (_campaignStatus == "Campaign failed") {
				result = await this.crowdfunding.checkGoalReached({from: owner})
				const event = result.logs[0].args
				//assert.equal(event.id.toNumber(), _numBacker.toNumber(), 'ID is correct')
				//assert.equal(event.name, 'Ram', 'name is correct')
				assert.equal(event.amount, '1000000000000000000', 'Amount is correct')
				assert.equal(event.backer, backer, 'Backer has deposited')
			}
			else{
				{
					assert.equal(_campaignStatus,"Funding","Campaign In Progress")
				}
			}
		})		
	})	
})