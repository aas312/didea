# DIdea

A decentralized hub to place ideas using the Ethereum blockchain and IPFS

## Concept

An idea consists on a title and a markdown file uploaded to IPFS. Whenever a user wants to store an idea in the smart contract it needs to stake `0.1` ether.

When an idea is created it can be updated or published. Only published ideas appears on the dapp home page.

When the idea is published other users can add votes (in signal of approval) to the idea staking `0.05` ether. The ideas with more votes are placed first in the dapp home page.

To recover the staked ether the idea must be abandoned or the vote has to be removed.

## Usage

### Dependencies

To install the dependencies run:

`yarn install`

### Local blockchain

First you need to run a local blockchain. [ganache-cli](https://github.com/trufflesuite/ganache-cli) is recomended.

The recomended ganache command is:

`ganache-cli -d -b 10`

### Dapp

To run the dapp execute the following command:

`yarn start`

This will migrate the contracts to the local blockchain and it will start a server at `http://localhost:8888`. To visit the dapp go to `http://localhost:8888`. You are going to need a browser with [metamask](https://metamask.io) to interact with the dapp.

`QmczwFFnBCbSo72QJ7qmM6rFp3YhvYRafRGq2cnuLTf3gK` is an example of an IPFS hash that belongs to a markdown file. Use this in case you don't want to upload a markdown file to IPFS.

### Tests

To run the tests execute:

`truffle test`

or

`yarn test`
