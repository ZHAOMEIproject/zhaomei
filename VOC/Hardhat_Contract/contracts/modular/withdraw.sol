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
// abstract 
abstract contract withdraw is EIP712, otherinfo{
    constructor(
            uint256 _mini_amount,address _token,address _add_withdraw,string memory name, string memory version,
            address _withdraw,address _admin,address _manage,address _monitor
        ) 
        EIP712(
            name, version
        )
        otherinfo(
            _withdraw,_admin,_manage,_monitor
        )
        {
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

    bytes32 public constant _PERMIT_TYPEHASH =
        keccak256("Permit(address owner,address spender,uint256 amount,bytes12 orderid,uint256 deadline)");

    event e_Withdraw(address indexed sender,address indexed to,uint256 amount,bytes12 indexed orderid);

    struct _signvrs{
        address auditor;
        address spender;
        uint256 amount;
        uint256 deadline;
        uint8 v;
        bytes32 r;
        bytes32 s;
        bytes12 orderid;
    }


    mapping(bytes12=>bool) public orderids;
    function Withdraw_permit_auditor (
        _signvrs memory signinfo
    ) public  onlyRole(WITHDRAW_ROLE) monitor_lock{
        if(orderids[signinfo.orderid]){
            return;
        }
        uint256 deadline=signinfo.deadline;
        require(block.timestamp <= deadline, "vii_Withdraw: expired deadline");
        address auditor=signinfo.auditor;
        address spender=signinfo.spender;
        uint256 amount=signinfo.amount;
        // 验证审核人员签名
        emit e_Withdraw(auditor,spender,amount,signinfo.orderid);
        address signer = signcheck(signinfo);
        require(hasRole(AUDITOR_ROLE,signer)&&signer==auditor, "vii_Withdraw: auditor invalid signature");
        orderids[signinfo.orderid]=true;
        // 进行操作
        IERC20(token).transferFrom(add_withdraw,spender,amount);
    }

    struct _spenderinfo{
        address spender;
        uint256 amount;
        bytes12 orderid;
    }

    function Withdraw_permit(
        _spenderinfo calldata spenderinfo
    ) public  onlyRole(WITHDRAW_ROLE) monitor_lock{
        require(spenderinfo.amount <= mini_amount, "vii_Withdraw: error amount");
        if(orderids[spenderinfo.orderid]){
            return;
        }
        orderids[spenderinfo.orderid]=true;
        IERC20(token).transferFrom(add_withdraw,spenderinfo.spender,spenderinfo.amount);
        emit e_Withdraw(msg.sender,spenderinfo.spender,spenderinfo.amount,spenderinfo.orderid);
    }
    function lot_Withdraw_permit(
         _spenderinfo[] calldata spenderinfo
    )public onlyRole(WITHDRAW_ROLE) monitor_lock{
        for(uint i=0;i<spenderinfo.length;i++){
            Withdraw_permit(spenderinfo[i]);
        }
    }

    function lot_Withdraw_permit_auditor(
         _signvrs[] calldata spenderinfo
    )public onlyRole(WITHDRAW_ROLE) monitor_lock{
        for(uint i=0;i<spenderinfo.length;i++){
            Withdraw_permit_auditor(spenderinfo[i]);
        }
    }

    function signcheck(
        _signvrs memory signinfo
    )public view returns(address signer){
        uint256 deadline=signinfo.deadline;
        address auditor=signinfo.auditor;
        address spender=signinfo.spender;
        uint256 amount=signinfo.amount;
        bytes12 orderid= signinfo.orderid;
        // 验证审核人员签名
        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, auditor, spender, amount,orderid, deadline));
        bytes32 hash = _hashTypedDataV4(structHash);
        return ECDSA.recover(hash, signinfo.v, signinfo.r, signinfo.s);
    }
}