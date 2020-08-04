const sharp = require("sharp");
const fs = require("fs");
const { createWorker } = require("tesseract.js");
const { Observable } = require("rxjs/Rx");
async function tess() {
  const tessWorker = createWorker({
    langPath: "."
  });
  await tessWorker.load();
  await tessWorker.loadLanguage("chi_sim");
  await tessWorker.initialize("chi_sim");
  console.time("tesser");
  const buff = await sharp("./screencap/res.png").toBuffer();
  const {
    data: { text }
  } = await tessWorker.recognize(buff);
  console.timeEnd("tesser");
  console.log(">>", text);

  process.exit();
}

function clip() {
  console.time("sharp");
  const file = fs.readFileSync("./screencap/2.png");
  sharp(file)
    .extract({ left: 1916, top: 965, width: 2088 - 1916, height: 1010 - 965 })
    // .toBuffer()
    .toFile("./screencap/res3.png")

    .then(data => {
      console.timeEnd("sharp");
      //   fs.writeFileSync("./screencap/res.png", data);
    });
}

// 感知哈希算法（Perceptual hash algorithm）
async function pha(path, is64) {
  let { data, info } = await sharp(path)
    .resize(32, 8, {
      fit: "contain"
    })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  var arr = [].slice.call(data, 0);
  if (is64) arr = arr.map(i => ~~(i / 3));
  let avg =
    arr.reduce((a, b) => {
      return a + b;
    }, 0) / arr.length;
  let re = arr.map(i => (i >= avg ? 1 : 0)).join("");
  //   console.log("hash", re);
  //   console.log("info", info);
  return re;
  // .toFile("./screencap/ra.png");
}

function compare(a, b) {
  let a1 = Array.from(a);
  let a2 = Array.from(b);
  let dif = a1.filter((i, ind) => i != a2[ind]).length;
  console.log((dif / a1.length) * 100);
}

async function histogram(path) {
  let { data, info } = await sharp(path)
    .resize(32, 8, {
      fit: "contain"
    })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  var arr = [].slice.call(data, 0);
  let hArr = Array(256).fill(0);
  arr.forEach(v => hArr[v]++);
  hArr = hArr.map(v => v / arr.length);

  return hArr;
}
function histogramDiff(a, b) {
  let hArr = a.map((v, ind) => {
    if (v && b[ind]) {
      return Math.sqrt(v * b[ind]);
    }
    return 0;
  });
  let sum = hArr.reduce((a, b) => a + b, 0);
  console.log(sum);
}
async function test() {
  console.time("test");
  //   compare(
  //     await pha("./screencap/res2.png", true),
  //     await pha("./screencap/res.png", true)
  //   );
  //   compare(await pha("./screencap/res2.png"), await pha("./screencap/res.png"));
  //   histogramDiff(
  //     await histogram("./screencap/res1.png", true),
  //     await histogram("./screencap/res.png", true)
  //   );
  // Rx.

  let mobileOb = Observable.create(observer => {
    observer.next("foo");
    setTimeout(() => observer.next("bar"), 1000);
  });
  // https://cn.rx.js.org/manual/tutorial.html#h22
  console.timeEnd("test");
}
test();
