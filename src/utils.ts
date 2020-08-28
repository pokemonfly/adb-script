const sharp = require("sharp");

async function getBufferString(input) {
  let { data } = await sharp(input)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let arr: any[] = [].slice.call(data, 0);
  return arr.join("");
}
async function pha(input, is64 = false) {
  let { data } = await sharp(input)
    // .resize(32, 8, {
    //   fit: "contain",
    // })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let arr: any[] = [].slice.call(data, 0);
  if (is64) arr = arr.map((i) => ~~(i / 3));
  let avg =
    arr.reduce((a, b) => {
      return a + b;
    }, 0) / arr.length;
  let re = arr.map((i) => (i >= avg ? 1 : 0)).join("");
  return re;
}
function comparePha(a, b) {
  let a1 = Array.from(a);
  let a2 = Array.from(b);
  let dif = a1.filter((i, ind) => i != a2[ind]).length;
  let rate = (dif / a1.length) * 100;
  return rate;
}
async function histogram(path) {
  let { data, info } = await sharp(path)
    // .resize(32, 8, {
    //   fit: "contain",
    // })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  var arr = [].slice.call(data, 0);
  let hArr = Array(256).fill(0);
  arr.forEach((v) => hArr[v]++);
  hArr = hArr.map((v) => v / arr.length);

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
  return sum;
}

export async function compare(inputA, inputB) {
  // let isSame = comparePha([].join.call(inputA, ""), [].join.call(inputB, ""));
  // let isSame = 0;  comparePha(await getBufferString(inputA), await getBufferString(inputB));
  let a = comparePha(await pha(inputA, true), await pha(inputB, true));
  let b = comparePha(await pha(inputA), await pha(inputB));
  let c = histogramDiff(await histogram(inputA), await histogram(inputB));
  return [a, b, c];
}

export function timeDelay(num: number) {
  return new Promise((res) => {
    setTimeout(res, num * 1e3);
  });
}
