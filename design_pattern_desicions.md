# Design patterns

## Fail early and fail loud

Every function checks for unwanted conditions at the begining. There are no silent fails.

This pattern is chosen to prevent malicious inputs and unwanted states.

## Restricting access

The functions that change the state of an idea require that the invoker (msg.sender) is actually the owner of that idea.

## Pull over push

The process to recover the stake of an idea or a vote happens in two steps.

1. The user abandon the idea or remove a vote.
2. The user call a function to recover the stake.

This pattern is used to prevent reentrancy attacks and DOS by gas limit.

## State machine

Every idea has a state. This state can be `Created`, `Published` or `Abandoned`. The states protects the ideas and the users. For example, an idea tha is `Published` cannot be updated and only `Published` ideas can be voted.
