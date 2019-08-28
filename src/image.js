const fs = require("fs");

const { createCanvas, loadImage } = require("canvas");

const W = 22.4;
const H = 10.8;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

function getHash(arr) {
    const length = arr.length;
    const average = arr.reduce((pre, next) => pre + next, 0) / length;
    return arr.map(item => (item >= average ? 1 : 0)).join("");
}

async function getImgHash(name) {
    const img = await loadImage(`./screencap/${name}.png`);
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, 0, 0, W, H);
    const data = ctx.getImageData(W * 0.75, H * 0.5, W * 0.25, H * 0.5).data;

    const grayList = [];
    data.forEach((c, index) => {
        if ((index + 1) % 4 === 0) {
            const c1 = data[index - 3];
            const c2 = data[index - 2];
            const c3 = data[index - 1];
            const gray = (c1 + c2 + c3) / 3;
            grayList.push(~~gray);
        }
    });
    return getHash(grayList);
}

module.exports = { getImgHash };
