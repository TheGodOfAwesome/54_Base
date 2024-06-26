//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract fSPY is ERC20 {
  address public owner = 0xd50901Bc02e386E88bee770259946bc2A1044Fd5; // Specify the minting authorized address

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can mint");
    _;
  }

  constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {}

  function mint(address account, uint256 amount) external onlyOwner {
    _mint(account, amount);
  }
}