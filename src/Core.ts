import { compare } from "./utils";

const chalk = require("chalk");
const sharp = require("sharp");

class Core {
  state: any;
  cfg: Config[];
  cache: any;
  lastUnfindRef: any;
  constructor({ cfg, defaultState }) {
    this.cfg = cfg;
    this.state = { state: "init", stoneCount: 0, count: 0, ...defaultState };
    this.cache = {};
    // this.clip()
    this.init();
  }
  init() {
    this.cfg.forEach((step) => {
      sharp(`./screencap/${step.file}.png`)
        .extract({
          left: step.field[0],
          top: step.field[1],
          width: step.field[2],
          height: step.field[3],
        })
        .toBuffer()
        .then((data) => {
          this.cache[step.file] = data;
        });
    });
  }
  clip() {
    this.cfg.forEach((step) => {
      sharp(`./screencap/${step.file}.png`)
        .extract({
          left: step.field[0],
          top: step.field[1],
          width: step.field[2],
          height: step.field[3],
        })
        .toFile(`./screencap/_${step.file}.png`);
    });
  }
  async deal(buf: Buffer): Promise<Action | false> {
    const arr = this.cfg
      // this.state.state == "init"
      //   ? this.cfg
      //   : this.cfg.filter((step) => {
      //       return step.needCheck(this.state);
      //     });
    let resStep: Config | null = null;
    if (!arr.length) {
      this.screenShot(buf);
      return false;
    }
    for (let i = 0; i < arr.length; i++) {
      let step = arr[i];
      let b = await sharp(buf)
        .extract({
          left: step.field[0],
          top: step.field[1],
          width: step.field[2],
          height: step.field[3],
        })
        .toBuffer();
      let res = await compare(this.cache[step.file], b);
      // console.log(step.name, res);
      this.state.compareRes = res;
      if (res[0] < 6 && res[1] < 6 && res[2] > 0.7) {
        resStep = step;
        break;
      }
    }
    if (!resStep) {
      if (this.lastUnfindRef) {
        let res = await compare(this.lastUnfindRef, buf)
        let b = res[0] < 6 && res[1] < 6 && res[2] > 0.7
        if (b) {
          this.lastUnfindRef = null
          this.screenShot(buf);
          return false
        } else {
          this.lastUnfindRef = buf
        }
      }
      this.lastUnfindRef = buf
      return { delay: 10 };
    }
    this.lastUnfindRef = null
    if (resStep.before && resStep.before(this.state) == false) {
      return false;
    }
    resStep.after && resStep.after(this.state);
    return resStep.action;
  }
  screenShot(buf) {
    let d = `./screencap/${+new Date()}.png`;
    sharp(buf).toFile(d);
    this.toLog();
    console.error("Unknown Scenes.  " + d);
  }
  toLog() {
    console.clear();
    console.log(
      `State: ${chalk.bold.green(this.state.state)}
Count: ${chalk.bold.green(this.state.count)}  StoneCount: ${chalk.bold.green(
        this.state.stoneCount
      )}
Pha: ${chalk.bold.green(this.state.compareRes[0])} ${chalk.bold.green(
        this.state.compareRes[1]
      )} Histogram: ${chalk.bold.green(this.state.compareRes[2])}
    `
    );
  }
}
export default Core;
