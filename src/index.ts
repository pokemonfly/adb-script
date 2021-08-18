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
  const action = await core.deal(buff);
  if (action === false) {
    // stop
    console.error("Stoped.");
    setTimeout(() => {
      process.exit()
    }, 2000)
    return 
  }
  if (action) {
    action.type && remote.touch(action);
    await timeDelay(action.delay || 1);
  }
  remote.next();
});
