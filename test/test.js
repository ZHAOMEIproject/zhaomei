const gm = require('gm');
const fs = require('fs');

const bgList = [
    "#d0ebff",
    "#ffc0d8",
    "#f7d3bd",
    "#c0f082",
    "#84c7f3",
    "#fffeea",
    "#05f5e0",
    "#ffd5b4",
    "#c0ccd8",
    "#d7d5d2",
    "#f7e4aa",
    "#cef9ad",
    "#f05050",
    "#72d6bf",
    "#e2a9af",
];


const createImg = (bg,name) => {
    const width = 2048;
    const height = 2048;

    gm(width, height, bg)
        .write(`./test/${name}.png`, (err) => {
            if (err) {
                console.log(err);
            }
        });
};

createImg(bgList[0],
    `test`)
