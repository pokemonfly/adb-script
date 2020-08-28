"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Remote_1 = require("./Remote");
const Core_1 = require("./Core");
const cfg_1 = require("./cfg");
// 
// (async function () {
//   const buff = await sharp("./screencap/1.png").resize(32, 32).toBuffer();
//   const url = buff.toString("base64");
// const b =  await sharp(Buffer.from(url, "base64")).toBuffer();
//   console.log(b.toString("base64") == url);
// })();
const defaultState = {
    state: 'Init',
    useStore: false,
    loopCount: 8
};
const core = new Core_1.default({ cfg: cfg_1.default, defaultState });
const remote = new Remote_1.default();
remote.connect();
remote.onImage((buff) => __awaiter(void 0, void 0, void 0, function* () {
    const action = yield core.deal(buff);
    // if (action) {
    //   remote.touch(action)
    // } 
    remote.next();
}));
//# sourceMappingURL=index.js.map