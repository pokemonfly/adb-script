// async function test(config) {
//   const hash = await getImgHash("now");
//   const arr = config.filter(item => {
//       return hash == item.hash;
//   });
//   if (arr.length > 0) {
//       console.log("当前页面", arr[0].name);
//   } else {
//       console.log("not find");
//   }
// }
const { createCanvas, loadImage } = require("canvas");
const {
    TesseractWorker,
    utils: { loadLang }
} = require("tesseract.js");
const tessWorker = new TesseractWorker({
    langPath: "."
});

const W = 552;
const H = 144;

// const W = 688 - 136;
// const H = 1014 - 870;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

async function test() {
    const filed = [136, 870, 688, 1014];
    const img = await loadImage(`./screencap/3.png`);
    ctx.drawImage(img, 136, 870, 688 - 136, 1014 - 870, 0, 0, W, H);
    let d = +new Date();
    tessWorker.recognize(canvas.toBuffer(), "chi_sim").then(data => {
        console.log(data.text.replace(/\s/g, ""));
        console.log(+new Date() - d);
    });
}

test();
