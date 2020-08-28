import Core from "./Core";
import cfg from "./cfg";
import { timeDelay, compare } from "./utils";

const sharp = require("sharp");

const step = cfg.filter(c => c.file == 'finish')[0];
sharp(`./screencap/1598596165013.png`)
  .extract({
    left: step.field[0],
    top: step.field[1],
    width: step.field[2],
    height: step.field[3],
  })
  .toBuffer()
  .then((target) => {
    sharp(`./screencap/${step.file}.png`)
      .extract({
        left: step.field[0],
        top: step.field[1],
        width: step.field[2],
        height: step.field[3],
      })
      .toBuffer()
      .then(async (base) => {
        let r = await compare(target, base);
        
        console.log(r);
      });
  });
