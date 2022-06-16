// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "./otherinfo.sol";

interface IERC20 {
    function transferFrom(address from, address to, uint amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}
abstract contract withdraw is EIP712, otherinfo{
    constructor(uint256 _mini_amount,address _token,address _add_withdraw,string memory name, string memory version) EIP712(name, version){
        set_info(_mini_amount,_token,_add_withdraw);
    }
    uint256 mini_amount;
    address token;
    address add_withdraw;
    function set_info(uint256 _mini_amount,address _token,address _add_withdraw)public onlyRole(MANAGE_ROLE){
        mini_amount=_mini_amount;
        token=_token;
        add_withdraw=_add_withdraw;
    }

    bytes32 private constant _PERMIT_TYPEHASH =
        keccak256("Permit(address owner,address spender,uint256 amount,uint256 nonce,uint256 deadline)");
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

    event e_Withdraw(address indexed sender,address indexed to,uint256 amount,uint256 nonce);

    struct _signvrs{
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    function Withdraw_permit_auditor (
        address auditor,
        address spender,
        uint256 amount,
        uint256 deadline,
        _signvrs memory signinfo
    ) public  onlyRole(WITHDRAW_ROLE) monitor_lock{
        require(block.timestamp <= deadline, "VIIDER_Withdraw: expired deadline");
        
        // 验证审核人员签名
        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, auditor, spender, amount, _useNonce(auditor), deadline));
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(hash, signinfo.v, signinfo.r, signinfo.s);
        require(signer == auditor, "VIIDER_Withdraw: auditor invalid signature");
        
        // 进行操作
        IERC20(token).transferFrom(add_withdraw,spender,amount);
        emit e_Withdraw(auditor,spender,amount,_nonces[auditor].current());
    }

    function Withdraw_permit(
        address spender,
        uint256 amount,
        uint256 nonce
    ) public  onlyRole(WITHDRAW_ROLE) monitor_lock{
        require(amount <= mini_amount, "VIIDER_Withdraw: error amount");
        require(nonce==_useNonce(msg.sender));
        IERC20(token).transferFrom(add_withdraw,spender,amount);
        emit e_Withdraw(msg.sender,spender,amount,_nonces[msg.sender].current());
    }
}