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
const child_process_1 = require("child_process");
const WebSocket = require("ws");
const PORT = 53519;
const WIDTH = 500;
const HEIGHT = 300;
function run(cmd) {
    return new Promise((res, rej) => {
        child_process_1.exec(cmd, function (error, stdout, stderr) {
            if (error !== null) {
                console.log("exec error: " + stderr);
                rej(stderr);
            }
            res(stdout);
        });
    });
}
class Remote {
    constructor() {
        this.onImageCallback = null;
        this.w = 0;
        this.h = 0;
        this.aspect = 1;
        this.rate = 1;
        this.rotation = 0;
        this._cache = [];
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let classPath = yield run(`adb shell pm path com.rayworks.droidcast`);
                classPath = classPath.replace("package:", "");
                classPath = classPath.replace(/\.apk\s+/, ".apk");
                yield child_process_1.exec(`adb forward tcp:${PORT} tcp:${PORT}`);
                yield child_process_1.exec(`adb shell CLASSPATH=${classPath} app_process / com.rayworks.droidcast.Main --port=${PORT}`);
                this.initWs();
            }
            catch (e) {
                console.log("Disconnect");
                if (this.ws) {
                    this.ws.close();
                }
            }
        });
    }
    initWs() {
        const ws = new WebSocket(`ws://127.0.0.1:${PORT}/ws`);
        ws.on("open", function open() {
            ws.send("info");
        });
        ws.on("message", this._onMessage.bind(this));
        this.ws = ws;
    }
    _onMessage(msg) {
        try {
            let { data } = msg;
            let obj = JSON.parse(data);
            // 基础信息
            if (obj.isRealSize) {
                this.w = Math.min(obj.height, obj.width);
                this.h = Math.max(obj.height, obj.width);
                this.aspect = this.h / this.w;
                this.resize();
                return;
            }
            if (obj.rotation && this.rotation != obj.rotation) {
                this.rotation = obj.rotation;
                this.resize();
                return;
            }
            // 图片分片
            if (obj.cur == 0) {
                this._cache = [];
            }
            this._cache.push(obj);
            if (this._cache.length == obj.len) {
                this._cache.sort((a, b) => {
                    return a.cur - b.cur;
                });
                let pic = this._cache.map((o) => o.data).join("");
                this.onImageCallback &&
                    this.onImageCallback(Buffer.from(pic, "base64"));
            }
        }
        catch (e) {
            // console.error(e, msg);
            console.log(e);
        }
    }
    resize(q = 90) {
        let w, h;
        if (this.rotation == 0) {
            w = Math.min(300, WIDTH);
            h = ~~(w * this.aspect);
        }
        else {
            w = Math.min(300, HEIGHT);
            h = ~~(w * this.aspect);
        }
        this.rate = this.w / w;
        this.ws.send(`w=${w}&h=${h}&q=${q}`);
    }
    next() {
        this.ws && this.ws.send("next");
    }
    onImage(callback) {
        this.onImageCallback = callback;
    }
    touch({ type, data }) {
        let dataStr = data.map((i) => i * this.rate).join(" ");
        child_process_1.exec(`adb shell input ${type} ${dataStr}`);
    }
}
exports.default = Remote;
// http://127.0.0.1:53519/screenshot
//# sourceMappingURL=Remote.js.map