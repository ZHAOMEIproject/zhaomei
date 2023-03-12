module.exports = {
    testembedding2dists,
    embedding2dists
}
const ndarray = require('ndarray');
const ops = require('ndarray-ops');
// {
//     var jsonFile = require('jsonfile')
//     let testinput = require('./test/embeddings.json');
//     let q_testinput = require('./test/q_embedding.json');
//     main();
//     async function main() {
//         // let simpleinput=[testinput[0]]
//         let dists = await embedding2dists(testinput,q_testinput)
//         console.log(dists);
//         await jsonFile.writeFileSync("./test/dists.json", dists, { spaces: 2, EOL: '\r\n' });
//     }
// }

const testresult = require('./test/dists.json');
function testembedding2dists() {
    return testresult;
}
// console.log(testembedding2dists());
async function embedding2dists(ebds, q_ebd) {
    ebds.map((vector) => {
        vector.ebd2nda = ndarray(vector.embedding);
    });

    q_ebd.ebd2nda = ndarray(q_ebd.embedding);
    // console.log(ebds[0].ebd2nda);
    // process.exit()
    ebds.map((vector) => {
        // process.exit()
        let diff;
        try {
            diff = new ndarray(Object.assign([], ebds[0].embedding));
            ops.sub(diff, vector.ebd2nda, q_ebd.ebd2nda);
            vector.distance = ops.norm2(diff);
        } catch (error) {
            console.log(error);
            vector.distance = 100;
        }
    });
    ebds.sort(
        (a, b) => a.distance - b.distance
    );
    return ebds;
}
