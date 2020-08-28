import { exec } from "child_process";
const WebSocket = require("ws");
const PORT = 53519;
const WIDTH = 500;
const HEIGHT = 300;
function run(cmd: string): Promise<string> {
  return new Promise((res, rej) => {
    exec(cmd, function (error, stdout, stderr) {
      if (error !== null) {
        console.log("exec error: " + stderr);
        rej(stderr);
      }
      res(stdout);
    });
  });
}
type ImageCallback = (img: Buffer) => void;
class Remote {
  ws: any;
  onImageCallback: null | ImageCallback = null;
  w = 0;
  h = 0;
  aspect = 1;
  rate = 1;
  rotation = -1;
  _cache: any[] = [];

  async connect() {
    try {
      let classPath = await run(`adb shell pm path com.rayworks.droidcast`);
      classPath = classPath.replace("package:", "");
      classPath = classPath.replace(/\.apk\s+/, ".apk");
      await exec(`adb forward tcp:${PORT} tcp:${PORT}`);
      await exec(
        `adb shell CLASSPATH=${classPath} app_process / com.rayworks.droidcast.Main --port=${PORT}`
      );
      this.initWs();
    } catch (e) {
      console.log("Disconnect");
      if (this.ws) {
        this.ws.close();
      }
    }
  }

  disconnect() {
    this.ws.close()
  }
  initWs() {
    const ws = new WebSocket(`ws://127.0.0.1:${PORT}/ws`);
    ws.on("open", function open() {
      ws.send("info");
    });
    ws.on("message", this._onMessage.bind(this));
    this.ws = ws;
  }
  _onMessage(msg: string) {
    let obj = JSON.parse(msg);
    if (obj.isRealSize && this.rotation == -1) {
      this.w = Math.min(obj.height, obj.width);
      this.h = Math.max(obj.height, obj.width);
      this.aspect = this.h / this.w;
    }
    if (this.w && obj.rotation && this.rotation != obj.rotation) {
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
      this.onImageCallback && this.onImageCallback(Buffer.from(pic, "base64"));
    }
  }
  resize(q = 90) {
    let w, h;
    if (this.rotation == 0) {
      w = Math.min(300, WIDTH);
      h = ~~(w * this.aspect);
    } else {
      w = Math.min(300, HEIGHT);
      h = ~~(w * this.aspect);
    }
    this.rate = this.w / w;
    this.ws.send(`w=${w}&h=${h}&q=${q}`);
  }
  next() {
    this.ws && this.ws.send("next");
  }
  onImage(callback: ImageCallback) {
    this.onImageCallback = callback;
  }

  touch({ type, data }: Action) {
    if (!type ||  !data) return
    let dataStr = data.map((i) => i * this.rate).join(" ");
    exec(`adb shell input ${type} ${dataStr}`);
  }
}
export default Remote;
// http://127.0.0.1:53519/screenshot
