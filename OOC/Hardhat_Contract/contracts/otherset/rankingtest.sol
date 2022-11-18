// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.4;

contract test{
    mapping(address=>uint256) mintnumber;
    address[] Ranking_list;
    struct communityinfo{
        address community;
        uint256 mintnumber;
    }
    function add_Ranking_list(address community,uint256 quantity)public{
        if(mintnumber[community] == 0){
            Ranking_list.push(community);
        }
        mintnumber[community] += quantity;
    }

    function view_hotlist()public view returns(communityinfo[] memory hotlist){
        uint256 i=Ranking_list.length;
        hotlist = new communityinfo[](i);
        for(uint j=0;j<i;j++){
            hotlist[j]=communityinfo(Ranking_list[j],mintnumber[Ranking_list[j]]);
            if(j>0){
                for(uint k=0;k<j;k++){
                    if(hotlist[j].mintnumber> hotlist[k].mintnumber){
                        (hotlist[j],hotlist[k])=(hotlist[k],hotlist[j]);
                    }
                }
            }
        }
    }
}