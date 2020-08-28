"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const sharp = require("sharp");
class Core {
    constructor({ cfg, defaultState }) {
        this.cfg = cfg;
        this.state = defaultState;
        this.init();
    }
    init() { }
    deal(buf) {
        const arr = this.cfg.filter((step) => {
            return step.needCheck(this.state);
        });
        if (arr.length) {
        }
        else {
            let d = `./screencap/${+new Date()}.png`;
            sharp(buf).toFile(d);
            throw new Error("Unknown Scenes.  " + d);
        }
        return false;
    }
    toLog() {
        console.clear();
        console.log(`State: ${chalk.bold.green(this.state.state)}
    `);
    }
}
exports.default = Core;
//# sourceMappingURL=Core.js.map