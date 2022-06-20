const {getcontractinfo}=require('./readcontracts');


test();
async function test(){
    console.log(await getcontractinfo());
}