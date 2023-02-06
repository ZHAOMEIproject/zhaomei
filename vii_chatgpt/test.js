
async function main(){
    {
        const map1 = new Map();
        map1.set('a', 1);
        map1.set('b', 2);
        map1.set('c', 3);
        map1['d']=1;
        console.log(map1, map1['a'],map1.get('d'));
        // console.log(map1.get('a'));
        // // Expected output: 1
    
        // map1.set('a', 97);
    
        // console.log(map1.get('a'));
        // // Expected output: 97
    
        // console.log(map1.size);
        // // Expected output: 3
    
        // map1.delete('b');
    
        // console.log(map1.size);
        // // Expected output: 2
    }
    // {
    //     var {v4} = await import('uuid');
    //     console.log(v4());
    //     console.log(v4());
    // }789
}
main()
