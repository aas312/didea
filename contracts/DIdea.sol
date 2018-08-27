pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

/** @title Decentralized Idea Hub. */
contract DIdea {
    // Use SafeMath to prevent overflows/underflows
    using SafeMath for uint256;

    // Event fired when an idea is created
    event IdeaCreated(
        uint256 indexed _index,
        address indexed _owner
    );

    // Event fired when an idea is updated
    event IdeaUpdated(
        uint256 indexed _index,
        address indexed _owner
    );

    // Event fired when an idea is published
    event IdeaPublished(
        uint256 indexed _index,
        address indexed _owner
    );

    // Event fired when an idea is abandoned
    event IdeaAbandoned(
        uint256 indexed _index,
        address indexed _owner
    );

    // Event fired when a vote is added
    event VoteAdded(
        uint256 indexed _ideaIndex,
        address indexed _ideaOwner,
        address indexed _voter
    );

    // Event fired when a vote is removed
    event VoteRemoved(
        uint256 indexed _ideaIndex,
        address indexed _ideaOwner,
        address indexed _voter
    );

    // Event fired when an idea stake is reimbursed
    event IdeaStakeReimbursed(
        address indexed _owner,
        uint256 indexed _amount
    );

    // Event fired when a vote stake is reimbursed
    event VoteStakeReimbursed(
        address indexed _owner,
        uint256 indexed _amount
    );

    enum IdeaState {
        Created,    // The idea was created. The idea can be updated
        Published,  // The idea is published. Votes can be added
        Abandonded  // The idea is abandoned. Votes cannot be added
    }

    struct Idea {
        uint256 index;      // The index in the array of ideas
        address owner;      // The owner of the idea
        uint256 votes;      // The votes of the idea
        IdeaState state;    // The state of the idea
        string url;         // The url/hash of the idea content
        string title;       // The title of the idea
    }

    // The array of ideas
    Idea[] public ideas;

    // Check if an address has added a vote to an idea (by index)
    mapping (address => mapping  (uint256 => bool)) public voted;

    // The amount of vote reimburses that an address have
    mapping (address => uint256) public votesToReimburse;

    // The amount of idea reimburses that an addres have
    mapping (address => uint256) public ideasToReimburse;

    // The stake for creating an idea
    uint256 public creationStake = 0.1 ether;

    // The stake for add a vote
    uint256 public voteStake = 0.05 ether;

    // The current number of ideas
    uint256 public ideasCount = 0;

    /** @dev This function is made for create a new idea and store it.
      * @param _title The title for the idea.
      * @param _url The url/hash for the idea's content.
      * @return bool true.
      */
    function createIdea(string _title, string _url) public payable returns (bool) {
        require(msg.value == creationStake);

        bytes memory urlBytes = bytes(_url);
        bytes memory titleBytes = bytes(_title);

        require(urlBytes.length > 0);
        require(titleBytes.length > 0);

        Idea memory idea = Idea({
            index: ideas.length,
            owner: msg.sender,
            votes: 0,
            state: IdeaState.Created,
            url: _url,
            title: _title
        });

        ideas.push(idea);
        ideasCount = ideasCount.add(1);

        emit IdeaCreated(idea.index, msg.sender);

        return true;
    }
    
    /** @dev This function is made for update an idea.
      * @param _ideaIndex The index to locate the idea in the array of ideas.
      * @param _title The new title for the idea.
      * @param _url The new url/hash for the idea.
      * @return bool true.
      */
    function updateIdea(uint256 _ideaIndex, string _title, string _url) public returns (bool) {
        Idea storage idea = ideas[_ideaIndex];

        require(idea.state == IdeaState.Created);

        bytes memory urlBytes = bytes(_url);
        bytes memory titleBytes = bytes(_title);

        require(urlBytes.length > 0);
        require(titleBytes.length > 0);

        require(idea.owner == msg.sender);

        idea.url = _url;
        idea.title = _title;

        emit IdeaUpdated(idea.index, idea.owner);

        return true;
    }
    
    /** @dev This function is made for publish an idea.
      * @param _ideaIndex The index to locate the idea in the array of ideas.
      * @return bool true.
      */
    function publishIdea(uint256 _ideaIndex) public returns (bool) {
        Idea storage idea = ideas[_ideaIndex];

        require(idea.state == IdeaState.Created);
        require(idea.owner == msg.sender);

        idea.state = IdeaState.Published;

        emit IdeaPublished(idea.index, idea.owner);

        return true;
    }

    /** @dev This function is made for abandon an idea.
      * @param _ideaIndex The index to locate the idea in the array of ideas.
      * @return bool true.
      */
    function abandonIdea(uint256 _ideaIndex) public returns (bool) {
        Idea storage idea = ideas[_ideaIndex];

        require(idea.state == IdeaState.Created || idea.state == IdeaState.Published);
        require(idea.owner == msg.sender);

        idea.state = IdeaState.Abandonded;

        uint256 reimburses = ideasToReimburse[msg.sender];
        ideasToReimburse[msg.sender] = reimburses.add(1);

        emit IdeaAbandoned(idea.index, idea.owner);

        return true;
    }

    /** @dev This function is made to add a vote to an idea.
      * @param _ideaIndex The index to locate the idea in the array of ideas.
      * @return bool true.
      */
    function addVote(uint256 _ideaIndex) public payable returns (bool) {
        require(msg.value == voteStake);
        require(!voted[msg.sender][_ideaIndex]);

        Idea storage idea = ideas[_ideaIndex];

        require(msg.sender != idea.owner);
        require(idea.state == IdeaState.Published);

        idea.votes = idea.votes.add(1);
        voted[msg.sender][_ideaIndex] = true;

        emit VoteAdded(idea.index, idea.owner, msg.sender);

        return true;
    }
    
    /** @dev This function is made to remove an idea's vote.
      * @param _ideaIndex The index to locate the idea in the array of ideas.
      * @return bool true
      */
    function removeVote(uint256 _ideaIndex) public returns (bool) {
        require(voted[msg.sender][_ideaIndex]);

        Idea storage idea = ideas[_ideaIndex];

        idea.votes = idea.votes.sub(1);
        voted[msg.sender][_ideaIndex] = false;
        uint256 reimburses = votesToReimburse[msg.sender];
        votesToReimburse[msg.sender] = reimburses.add(1);

        emit VoteRemoved(idea.index, idea.owner, msg.sender);

        return true;
    }

    /** @dev This function is made to claim the idea creation stakes.
      * @return bool true
      */
    function claimIdeaStake() public returns (bool) {
        uint256 reimbursements = ideasToReimburse[msg.sender];

        require(reimbursements > 0);

        ideasToReimburse[msg.sender] = 0;

        uint256 reimbursed = reimbursements.mul(creationStake);

        msg.sender.transfer(reimbursed);

        emit IdeaStakeReimbursed(msg.sender, reimbursed);

        return true;
    }

    /** @dev This function is made to claim the vote stakes.
      * @return bool true
      */
    function claimVoteStake() public returns (bool) {
        uint256 reimbursements = votesToReimburse[msg.sender];

        require(reimbursements > 0);

        votesToReimburse[msg.sender] = 0;

        uint256 reimbursed = reimbursements.mul(voteStake);

        msg.sender.transfer(reimbursed);

        emit VoteStakeReimbursed(msg.sender, reimbursed);

        return true;
    }
}
