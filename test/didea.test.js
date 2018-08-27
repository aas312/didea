const DIdea = artifacts.require("DIdea");
const chai = require("chai");

chai.use(require("chai-as-promised"));

const expect = chai.expect;

contract("DIdea", (accounts) => {
  let dIdea;

  const ideaStake = web3.toWei(0.1, "ether");
  const voteStake = web3.toWei(0.05, "ether");
  const states = {
    CREATED: 0,
    PUBLISHED: 1,
    ABANDONED: 2,
  };

  const owner = accounts[0];

  beforeEach(async () => {
    dIdea = await DIdea.new();
  });

  describe("create idea", () => {
    const validUrl = "url";
    const validTitle = "title"

    /**
     * This test should cover the emit of the IdeaCreated event.
     *
     * This test was written to be sure that the event is fired.
     */
    it("should create an idea", async () => {
      const { logs } = await dIdea.createIdea(validTitle, validUrl, { value: ideaStake, from: owner });

      expect(logs).to.have.length(1);

      const { event, args } = logs[0];

      expect(event).to.be.equal("IdeaCreated");
      expect(args._index.toString()).to.be.equal("0");
      expect(args._owner).to.be.equal(owner);
    });

    /**
     * This test should cover `require(msg.value == creationStake)`
     * 
     * This test was written to be sure that the transaction will
     * fail if this condition is not meet.
     */
    it("should revert if the transaction value is different from 1 ether", async () => {
        await expect(dIdea.createIdea(validTitle, validUrl, { value: web3.toWei(0.099, "ether"), from: owner })).to.be.rejectedWith(/revert/);
        await expect(dIdea.createIdea(validTitle, validUrl, { value: web3.toWei(0.11, "ether"), from: owner })).to.be.rejectedWith(/revert/);
        await expect(dIdea.createIdea(validTitle, validUrl, { value: 0, from: owner })).to.be.rejectedWith(/revert/);
    });

    /**
     * This test should cover `require(titleBytes.length > 0)`
     * 
     * This test was written to be sure that the transaction will
     * fail if this condition is not meet.
     */
    it("should revert if the title is empty", async () => {
        await expect(dIdea.createIdea("", validUrl, { value: ideaStake, from: owner })).to.be.rejectedWith(/revert/); 
    });

    /**
     * This test should cover `require(urlBytes.length > 0)`
     * 
     * This test was written to be sure that the transaction will
     * fail if this condition is not meet.
     */
    it("should revert if the url is empty", async () => {
        await expect(dIdea.createIdea(validTitle, "", { value: ideaStake, from: owner })).to.be.rejectedWith(/revert/); 
    });
  });

  describe("get idea", () => {
    /**
     * This test was written to be sure that the idea is
     * added tho the ideas public array and that the idea
     * can be retrieved by index.
     */
    it("should return the idea data", async () => {
      const ideaUrl = "the idea url";
      const ideaTitle = "the idea title";
      const ideaOwner = accounts[1];

      await dIdea.createIdea(ideaTitle, ideaUrl, { value: ideaStake, from: ideaOwner });

      const idea = await dIdea.ideas.call(0);
      
      expect(idea[0].toString()).to.be.equal("0");
      expect(idea[1]).to.be.equal(ideaOwner);
      expect(idea[2].toString()).to.be.equal("0");
      expect(idea[3].toNumber()).to.be.equal(states.CREATED);
      expect(idea[4]).to.be.equal(ideaUrl);
      expect(idea[5]).to.be.equal(ideaTitle);
    }); 
  });

  describe("update an idea", () => {
    const ideaUrl = "the old idea url";
    const ideaTitle = "the old idea title";
    const url = "the new idea url";
    const title = "the new idea title";

    beforeEach(async () => {
      await dIdea.createIdea(ideaTitle, ideaUrl, { value: ideaStake, from: owner });
    });

    /**
     * This test was written to be sure that the event `IdeaUpdated`
     * is fired when the idea is updated
     */
    it("should update an idea", async () => {
      const { logs } = await dIdea.updateIdea(0, title, url, { from: owner });

      expect(logs).to.have.length(1);

      const { event, args } = logs[0];

      expect(event).to.be.equal("IdeaUpdated");
      expect(args._index.toString()).to.be.equal("0");
      expect(args._owner).to.be.equal(owner);
    });

    /**
     * This test was written to check that the ideas was actually
     * updated
     */
    it("should change the idea url and title", async () => {
      await dIdea.updateIdea(0, title, url, { from: owner });

      const idea = await dIdea.ideas.call(0);

      expect(idea[4]).to.be.equal(url);
      expect(idea[5]).to.be.equal(title);
    });

    /**
     * This test was written to check that the transaction will fail
     * if the url is empty.
     */
    it("should fail if the url is empty", async () => {
      await expect(dIdea.updateIdea(0, title, "", { from: owner })).to.be.rejectedWith(/revert/);
    });

    /**
     * This test was written to check that the transaction will fail
     * if the title is empty
     */
    it("should fail if the title is empty", async () => {
      await expect(dIdea.updateIdea(0, "", url, { from: owner })).to.be.rejectedWith(/revert/);
    });

    /**
     * This test was written to check that the transaction will fail
     * if the sender is not the owner of the idea.
     */
    it("should fail if the sender is not the owner", async () => {
      const notOwner = accounts[2];

      await expect(dIdea.updateIdea(0, "not empty", "not empty", { from: notOwner })).to.be.rejectedWith(/revert/);
    });

    /**
     * This test was written to check that the transaction will fail
     * if the idea is already published.
     */
    it("should fail if the idea is already published", async () => {
      await dIdea.publishIdea(0, { from: owner });

      await expect(dIdea.updateIdea(0, "not empty", "not empty", { from: owner })).to.be.rejectedWith(/revert/);
    });

    /**
     * This test was written to check that the transaction will fail
     * if the idea is abandoned
     */
    it("should fail if the idea is already abandoned", async () => {
      await dIdea.abandonIdea(0, { from: owner });

      await expect(dIdea.updateIdea(0, "not empty", "not empty", { from: owner })).to.be.rejectedWith(/revert/);
    });
  });

  describe("publish idea", () => {
    const url = "the url";
    const title = "the title"

    beforeEach(async () => {
      await dIdea.createIdea(title, url, { value: ideaStake, from: owner });
    });

    /**
     * This test was written to be sure that the `IdeaPublished` event
     * is fired when publishing an idea
     */
    it("should publish the idea", async () => {
      const { logs } = await dIdea.publishIdea(0, { from: owner });

      expect(logs).to.have.length(1);

      const { event, args } = logs[0];

      expect(event).to.be.equal("IdeaPublished");
      expect(args._index.toString()).to.be.equal("0");
      expect(args._owner).to.be.equal(owner);
    });

    /**
     * This test was written to be sure that the idea state
     * is updated
     */
    it("should change the idea state", async () => {
      await dIdea.publishIdea(0, { from: owner });

      const idea = await dIdea.ideas.call(0);

      expect(idea[3].toNumber()).to.be.equal(states.PUBLISHED);
    });

    /**
     * This test was written to check that the transaction will fail
     * if the sender is not the owner of the idea
     */
    it("should revert if the message sender is not the owner", async () => {
      const notOwner = accounts[2];

      await expect(dIdea.publishIdea(0, { from: notOwner })).to.be.rejectedWith(/revert/);
    });

    /**
     * This test was written to check that the transaction will fail
     * if the idea is already published
     */
    it("should revert if the idea is already published", async () => {
      await dIdea.publishIdea(0, { from: owner });

      await expect(dIdea.publishIdea(0, { from: owner })).to.be.rejectedWith(/revert/);
    });

    /**
     * This test was written to check that the transaction will fail
     * if the idea is abandoned
     */
    it("should revert if the idea is abandoned", async () => {
      await dIdea.abandonIdea(0, { from: owner });

      await expect(dIdea.publishIdea(0, { from: owner })).to.be.rejectedWith(/revert/);
    });
  });

  describe("abandon idea", () => {
    const url = "the idea url";
    const title = "the idea title";

    beforeEach(async () => {
      await dIdea.createIdea(title, url, { value: ideaStake, from: owner });
    });

    /**
     * This test was written to be sure that the `IdeaAbandoned` event
     * is fired
     */
    it("should abandon a created idea", async () => {
      const { logs } = await dIdea.abandonIdea(0, { from: owner });

      expect(logs).to.have.length(1);

      const { event, args } = logs[0];

      expect(event).to.be.equal("IdeaAbandoned");
      expect(args._index.toString()).to.be.equal("0");
      expect(args._owner).to.be.equal(owner);
    });

    /**
     * This test was written to be sure that an idea can be abandoned if
     * its published
     */
    it("should abandon a published idea", async () => {
      await dIdea.publishIdea(0, { from: owner });

      const { logs } = await dIdea.abandonIdea(0, { from: owner });

      expect(logs).to.have.length(1);

      const { event, args } = logs[0];

      expect(event).to.be.equal("IdeaAbandoned");
      expect(args._index.toString()).to.be.equal("0");
      expect(args._owner).to.be.equal(owner);
    });

    /**
     * This test was written to be sure that the idea state is
     * updated
     */
    it("should change the idea state", async () => {
      await dIdea.abandonIdea(0, { from: owner });

      const idea = await dIdea.ideas.call(0);

      expect(idea[3].toNumber()).to.be.equal(states.ABANDONED);
    });

    /**
     * This test was written to be sure that the reimbursements
     * mapping is updated
     */
    it("should update the ideas reimbursement mapping", async() => {
      await dIdea.abandonIdea(0, { from: owner });

      const reimbursements = await dIdea.ideasToReimburse.call(owner);

      expect(reimbursements.toNumber()).to.be.equal(1);
    })

    /**
     * This test was written to check that the transaction will fail
     * if the sender is not the owner
     */
    it("should fail if the message sender is not the owner", async () => {
      const notOwner = accounts[2];

      await expect(dIdea.abandonIdea(0, { from: notOwner })).to.be.rejectedWith(/revert/);
    });

    /**
     * This test was written to check that the transaction will fail
     * if the idea is already abandoned
     */
    it("should fail if the idea is already abandoned", async () => {
      await dIdea.abandonIdea(0, { from: owner });

      await expect(dIdea.abandonIdea(0, { from: owner })).to.be.rejectedWith(/revert/);
    });
  });

  describe("vote idea", () => {
    const url = "the idea url";
    const title = "the idea title";
    const voteOwner = accounts[1];

    beforeEach(async () => {
      await dIdea.createIdea(title, url, { value: ideaStake, from: owner });
      await dIdea.publishIdea(0, { from: owner });
    });

    /**
     * This test was written to be sure that the event `VoteAdded`
     * is fired
     */
    it("should vote for an idea", async () => {
      const { logs } = await dIdea.addVote(0, { value: voteStake, from: voteOwner });

      expect(logs).to.have.length(1);

      const { event, args } = logs[0];

      expect(event).to.be.equal("VoteAdded");
      expect(args._ideaIndex.toString()).to.be.equal("0");
      expect(args._ideaOwner).to.be.equal(owner);
      expect(args._voter).to.be.equal(voteOwner);
    });

    /**
     * This test was written to be sure that the idea's votes
     * are incremented
     */
    it("should update the votes of the idea", async () => {
      await dIdea.addVote(0, { value: voteStake, from: voteOwner });

      const idea = await dIdea.ideas.call(0);

      expect(idea[2].toNumber()).to.be.equal(1);
    });

    /**
     * This test was written to be sure that the voted mapping
     * is updated
     */
    it("should update the voted mapping", async () => {
      await dIdea.addVote(0, { value: voteStake, from: voteOwner });

      const voted = await dIdea.voted.call(voteOwner, 0);

      expect(voted).to.be.true;
    });

    /**
     * This test was written to check that the transaction will fail
     * if the sender is the owner
     */
    it("should revert if the voter is the idea owner", async () => {
      await expect(dIdea.addVote(0, { value: voteStake, from: owner })).to.be.rejectedWith(/revert/);
    });

    /**
     * This test was written to check that the transaction will fail
     * if the sender already voted
     */
    it("should revert if the voter already voted", async () => {
      await dIdea.addVote(0, { value: voteStake, from: voteOwner });
      
      await expect(dIdea.addVote(0, { value: voteStake, from: voteOwner })).to.be.rejectedWith(/revert/);
    });

    /**
     * This test was written to check that the transaction will fail
     * if the vote stake is not acomplished
     */
    it("should revert if the value is different from the vote stake", async () => {
      await expect(dIdea.addVote(0, { value: web3.toWei(0.049, "ether"), from: voteOwner })).to.be.rejectedWith(/revert/);
      await expect(dIdea.addVote(0, { value: web3.toWei(0.051, "ether"), from: voteOwner })).to.be.rejectedWith(/revert/);
      await expect(dIdea.addVote(0, { value: web3.toWei(0, "ether"), from: voteOwner })).to.be.rejectedWith(/revert/);
    });

    /**
     * This test was written to check that the transaction will fail
     * if the idea is not published
     */
    it("should revert if the idea is not published", async() => {
      await dIdea.createIdea(title, url, { value: ideaStake, from: owner });

      await expect(dIdea.addVote(1, { value: voteStake, from: voteOwner })).to.be.rejectedWith(/revert/);

      await dIdea.abandonIdea(1, { from: owner });

      await expect(dIdea.addVote(1, { value: voteStake, from: voteOwner })).to.be.rejectedWith(/revert/);
    });
  });

  describe("remove vote", () => {
    const voteOwner = accounts[1];
    const url = "the idea url";
    const title = "the idea title";

    beforeEach(async () => {
      await dIdea.createIdea(title, url, { value: ideaStake, from: owner });
      await dIdea.publishIdea(0, { from: owner });
      await dIdea.addVote(0, { value: voteStake, from: voteOwner });
    });

    /**
     * This test was written to be sure that the event `VoteRemoved` is
     * fired
     */
    it("should emit an event", async () => {
      const { logs } = await dIdea.removeVote(0, { from: voteOwner });

      expect(logs).to.have.length(1);

      const { event, args } = logs[0];

      expect(event).to.be.equal("VoteRemoved");
      expect(args._ideaIndex.toString()).to.be.equal("0");
      expect(args._ideaOwner).to.be.equal(owner);
      expect(args._voter).to.be.equal(voteOwner);
    });

    /**
     * This test was written to be sure that the idea's votes
     * are reduced
     */
    it("should reduce the idea votes", async () => {
      await dIdea.removeVote(0, { from: voteOwner });

      const idea = await dIdea.ideas.call(0);

      expect(idea[2].toNumber()).to.be.equal(0);
    });
  
    /**
     * This test was written to check that te sender is removed
     * from the voted mapping
     */
    it("should remove the voter from voted", async () => {
      await dIdea.removeVote(0, { from: voteOwner });

      const voted = await dIdea.voted.call(voteOwner, 0);

      expect(voted).to.be.false;
    });

    /**
     * This test was written to check that the votes reimburses
     * are updated
     */
    it("should add a vote reimbursement", async () => {
      await dIdea.removeVote(0, { from: voteOwner });

      const reimbursements = await dIdea.votesToReimburse.call(voteOwner);

      expect(reimbursements.toNumber()).to.be.equal(1);
    });
  });

  describe("claim idea stake", () => {
    const url = "the idea url";
    const title = "the idea title";

    beforeEach(async () => {
      await dIdea.createIdea(title, url, { value: ideaStake, from: owner });
      await dIdea.abandonIdea(0, { from: owner });
    });

    /**
     * This test was written to check that the event `IdeaStakeReimbursed`
     * is fired
     */
    it("should reimburse the idea stake", async () => {
      const { logs } = await dIdea.claimIdeaStake({ from: owner });
      
      expect(logs).to.have.length(1);

      const { event, args } = logs[0];

      expect(event).to.be.equal("IdeaStakeReimbursed");
      expect(args._owner).to.be.equal(owner);
      expect(args._amount.toString()).to.be.equal(ideaStake);
    });

    /**
     * This test was written to check that the ideas to reimburse
     * are reduced
     */
    it("should reduce the ideas to reimburse", async () => {
      await dIdea.claimIdeaStake({ from: owner });

      const reimbursements = await dIdea.ideasToReimburse.call(owner);

      expect(reimbursements.toNumber()).to.be.equal(0);
    });

    /**
     * This test was written to check that the transaction will fail
     * if the sender doesn't have reimbursements
     */
    it("should fail if the message sender doesn't have reimbursements", async () => {
      await expect(dIdea.claimIdeaStake({ from: accounts[2] })).to.be.rejectedWith(/revert/);
    });
  });

  describe("claim vote stake", () => {
    const url = "the idea url";
    const title = "the idea title";
    const voteOwner = accounts[1];

    beforeEach(async () => {
      await dIdea.createIdea(title, url, { value: ideaStake, from: owner });
      await dIdea.publishIdea(0, { from: owner });
      await dIdea.addVote(0, { value: voteStake, from: voteOwner });
      await dIdea.removeVote(0, { from: voteOwner });
    });

    /**
     * This test was written to check that the event `VoteStakeReimbursed`
     * is fired
     */
    it("should reimburse the vote stake", async () => {
      const { logs } = await dIdea.claimVoteStake({ from: voteOwner });

      expect(logs).to.have.length(1);

      const { event, args } = logs[0];

      expect(event).to.be.equal("VoteStakeReimbursed");
      expect(args._owner).to.be.equal(voteOwner);
      expect(args._amount.toString()).to.be.equal(voteStake);
    });

    /**
     * This test was written to check that the votes to reimburse
     * are increased
     */
    it("should reduce the votes to reimburse", async () => {
      await dIdea.claimVoteStake({ from: voteOwner });

      const reimbursements = await dIdea.votesToReimburse.call(voteOwner);

      expect(reimbursements.toNumber()).to.be.equal(0);
    });

    /**
     * This test was written to check that the transaction will fail
     * if the sender doesn't have reimbursements
     */
    it("should revert if the message sender doesn't have reimbursements", async () => {
      await expect(dIdea.claimIdeaStake({ from: accounts[2] })).to.be.rejectedWith(/revert/);
    });
  });
});
