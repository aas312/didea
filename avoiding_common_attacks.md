# Avoiding common attacks

## Reentrancy and DOS

To prevent reentrancy attacks and DOS by gas limit the `push over pull` pattern is used when the users want to recover the staked ether used to create an idea o add a vote.

## Integer overflow and underflow

To prevent integer overflows and underflows the `openzeppelin` `SafeMath` library is used.

