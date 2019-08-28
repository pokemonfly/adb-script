const { getScreenshot, click } = require("./adb");
const { getImgHash, ocr } = require("./image");
const baseConfig = [
    {
        image: "1",
        name: "准备进入",
        action: { x: 1960, y: 993, r: 10 },
        delay: 2e3,
        field: [1814, 868, 2091, 909]
    },
    {
        image: "5",
        name: "准备进入",
        action: { x: 1960, y: 993, r: 10 },
        delay: 2e3,
        field: [1814, 868, 2091, 909]
    },
    {
        image: "2",
        name: "队伍确认",
        action: { x: 1820, y: 750, r: 20 },
        delay: 2e3,
        field: [1737, 583, 1887, 945]
    },
    {
        name: "战斗结束",
        ocr: "行动结束",
        action: { x: 1860, y: 900, r: 50 },
        delay: 5e3,
        field: [136, 870, 688, 1014]
    },
    {
        image: "4",
        name: "理智不足",
        field: [1119, 87, 1560, 132]
    }
];
let _lastPage = 0;
async function shrinkingImg(list) {
    const l = await Promise.all(
        list.map(async obj => {
            if (!obj.image) return obj;
            const hash = await getImgHash(obj.image, obj.field);
            return {
                ...obj,
                hash
            };
        })
    );
    return l;
}
async function runner(config) {
    getScreenshot("now").then(async () => {
        let res = null;
        let _delay = 5e3;
        for (let i = 0; i < config.length; i++) {
            if (config[i].ocr) {
                let text = await ocr("now", config[i].field);
                if (text == config[i].ocr) {
                    res = config[i];
                    break;
                }
            } else {
                let hash = await getImgHash("now", config[i].field);
                if (hash == config[i].hash) {
                    res = config[i];
                    break;
                }
            }
        }
        if (res) {
            let { action, name, delay } = res;
            console.log("当前页面", name);
            if (action) {
                click(action);
            }
            _lastPage = name;
            _delay = delay;
        }
        setTimeout(() => {
            runner(config);
        }, ~~(_delay + 500 * Math.random()));
    });
}
async function main() {
    const config = await shrinkingImg(baseConfig);
    runner(config);
    // test(config);
}

main();
