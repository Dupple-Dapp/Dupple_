// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

library Events {
    event UserRegistered(address indexed user);
    event MessageSent(
        address indexed sender,
        address indexed to,
        string content
    );
    event Liked(address liker, address likee);
    event Disliked(address disliker, address dislikee);
    event Matched(address accepter, address acceptee);
    event Blocked(address blocker, address blockee);
    event UnBlocked(address blocker, address blockee);
    event ResetUserDailyMessages(address user);
    event Tipped(address tipper, address tippee, uint tipAmount);
    event PaidToReturnTop10Percent(address user);
    event ChangeDailyMessageLimit(uint newNum);
    event WithdrawToOwner(uint balance);
}
