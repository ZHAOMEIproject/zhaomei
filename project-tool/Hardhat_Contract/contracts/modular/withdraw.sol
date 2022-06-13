// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Ownable.sol";
import "@openzeppelin/contracts/utils/ECDSA.sol";
import "@openzeppelin/contracts/utils/draft-EIP712.sol";
import "./otherinfo.sol";

interface IERC20 {
    function transferFrom(address from, address to, uint value) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}
abstract contract withdraw is EIP712, otherinfo{
    constructor(uint256 _mini_amount,address _token,string memory name, string memory version) EIP712(name, version){
        mini_amount=_mini_amount;
        token =_token;
    }
    uint256 mini_amount;
    address token;
    bytes32 private constant _PERMIT_TYPEHASH =
        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
    

    using Counters for Counters.Counter;
    mapping(address => Counters.Counter) private _nonces;
    function nonces(address owner) public view  returns (uint256) {
        return _nonces[owner].current();
    }
    function _useNonce(address owner) internal returns (uint256 current) {
        Counters.Counter storage nonce = _nonces[owner];
        current = nonce.current();
        nonce.increment();
    }

    event e_Withdraw(address indexed sender,address indexed to,uint256 value,uint256 nonce);

    function Withdraw_permit_auditor (
        address auditor,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public  onlyRole(WITHDRAW_ROLE) monitor_lock{
        require(block.timestamp <= deadline, "VIIDER_Withdraw: expired deadline");
        emit e_Withdraw(auditor,spender,value,_nonces[auditor].current());
        
        // 验证审核人员签名
        structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, auditor, spender, value, _useNonce(auditor), deadline));
        hash = _hashTypedDataV4(structHash);
        signer = ECDSA.recover(hash, v, r, s);
        require(signer == auditor, "VIIDER_Withdraw: auditor invalid signature");
        
        // 进行操作
        IERC20(token).transferFrom(super.owner(),spender,value);
    }

    function Withdraw_permit(
        address spender,
        uint256 value,
        uint256 deadline
    ) public  onlyRole(WITHDRAW_ROLE) monitor_lock{
        require(block.timestamp <= deadline, "VIIDER_Withdraw: expired deadline");
        require(value <= mini_amount, "VIIDER_Withdraw: error value");
        require(_msgSender()==server,"VIIDER_Withdraw: only server can transfer");
        emit e_Withdraw(server,spender,value,_nonces[server].current());

        IERC20(token).transferFrom(super.owner(),spender,value);
    }
}