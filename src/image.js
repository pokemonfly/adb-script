const fs = require("fs");

const { createCanvas, loadImage } = require("canvas");
const { TesseractWorker } = require("tesseract.js");
const tessWorker = new TesseractWorker({
    langPath: "."
});

const W = 224;
const H = 108;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

function getHash(arr) {
    const length = arr.length;
    const average = arr.reduce((pre, next) => pre + next, 0) / length;
    return arr.map(item => (item >= average ? 1 : 0)).join("");
}

async function getImgHash(name, filed) {
    const img = await loadImage(`./screencap/${name}.png`);
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, 0, 0, W, H);
    const data = ctx.getImageData(
        filed[0] / 10,
        filed[1] / 10,
        filed[2] / 10,
        filed[3] / 10
    ).data;

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

async function ocr(name, filed) {
    const img = await loadImage(`./screencap/${name}.png`);
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(
        img,
        filed[0],
        filed[1],
        filed[2] - filed[0],
        filed[3] - filed[1],
        0,
        0,
        W,
        H
    );

    const data = await tessWorker.recognize(canvas.toBuffer(), "chi_sim");
    return data.text.replace(/\s/g, "");
}
module.exports = { getImgHash, ocr };
