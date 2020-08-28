const process = require("child_process");

function exec(cmd) {
    return new Promise((res, rej) => {
        process.exec(cmd, function(error, stdout, stderr) {
            if (error !== null) {
                console.log("exec error: " + error);
                rej(error);
            }
            res();
        });
    });
}

function getScreenshot(name) {
    return exec(`adb exec-out screencap -p > ./screencap/${name}.png`);
}

function click({ x, y, r = 5 }) {
    x = x - r + Math.random() * r * 2;
    y = y - r + Math.random() * r * 2;

    return exec(`adb shell input tap ${x} ${y}`);
}

module.exports = {
    getScreenshot,
    click
};
