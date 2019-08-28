const { getScreenshot, click } = require("./adb");
const { getImgHash } = require("./image");
const baseConfig = [
    {
        image: "1",
        name: "准备进入",
        action: { x: 1960, y: 980, r: 10 },
        delay: 2e3
    },
    {
        image: "2",
        name: "选人",
        action: { x: 1820, y: 750, r: 20 },
        delay: 2e3
    },
    {
        image: "3",
        name: "战斗结束",
        action: { x: 1860, y: 900, r: 50 },
        delay: 5e3
    },
    {
        image: "4",
        name: "理智不足"
    }
];
let _lastPage = 0;
async function shrinkingImg(list) {
    const l = await Promise.all(
        list.map(async obj => {
            const hash = await getImgHash(obj.image);
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
        const hash = await getImgHash("now");
        const arr = config.filter(item => {
            return hash == item.hash;
        });
        let _delay = 1e4;
        if (arr.length > 0) {
            let { action, name, delay } = arr[0];
            console.log("当前页面", name);
            if (name == _lastPage) {
                getScreenshot("error" + +new Date());
                throw new Error("页面未跳转");
            }
            click(action);
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

async function test(config) {
    const hash = await getImgHash("now");
    const arr = config.filter(item => {
        return hash == item.hash;
    });
    if (arr.length > 0) {
        console.log("当前页面", arr[0].name);
    } else {
        console.log("not find");
    }
}
main();
