import Remote from "./Remote";
import Core from "./Core";
import cfg from "./cfg";
import { timeDelay } from "./utils";

const defaultState = {
  useStone: true, // 恰石头
  loopCount: 999, // 次数
};
const core = new Core({ cfg, defaultState });
const remote = new Remote();
remote.connect();
remote.onImage(async (buff) => {
  await core.screenShot(buff);
  setTimeout(() => {
    process.exit()
  }, 2000)
});
