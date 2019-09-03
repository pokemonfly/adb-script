const { getImgHash, ocr } = require("./image");

async function test() {
    let res = await ocr("4", [1252, 100, 1460, 137]);
    console.log(res);
}
test();
