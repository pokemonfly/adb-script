export default [
  {
    name: "开始行动",
    file: "menu",
    field: [465, 35, 77, 28],
    needCheck: (state) => {
      return ["menu", "finish"].includes(state.state);
    },
    before: (state) => {
      if (state.count > state.loopCount) {
        console.log('Max Count')
        return false;
      }
    },
    action: {
      type: "tap",
      data: [538, 257],
      delay: 1,
    },
    after: (state) => {
      state.state = "menu";
    },
  },
  {
    name: "开始行动-选人",
    file: "prepare",
    field: [429, 9, 30, 17],
    needCheck: (state) => {
      return state.state == "menu";
    },
    action: {
      type: "tap",
      data: [480, 180],
      // delay: 10,
    },
    after: (state) => {
      state.state = "prepare";
    },
  },
  {
    name: "理智药",
    file: "drug",
    field: [309, 35, 100, 18],
    needCheck: (state) => {
      return state.state == "menu";
    },
    action: {
      type: "tap",
      data: [499, 240],
      delay: 5,
    },
  },
  {
    name: "理智药",
    file: "stone",
    field: [309, 35, 100, 18],
    needCheck: (state) => {
      return state.state == "menu";
    },
    action: {
      type: "tap",
      data: [499, 240],
      delay: 5,
    },
    before: (state) => {
      if (!state.useStone) {
        console.log('Not use stone')
        return false;
      }
    },
    after: (state) => {
      if (!state.lock) {
        state.stoneCount++;
        state.lock = true;
        setTimeout(() => {
          state.lock = false;
        }, 1e4);
      }
    },
  },
  {
    name: "战斗中",
    file: "battle",
    field: [325, 4, 18, 18],
    action: {
      // delay: 2,
    },
    needCheck: (state) => {
      return ["prepare", "battle"].includes(state.state);
    },
    after: (state) => {
      state.state = "battle";
    },
  },
  {
    name: "结束",
    file: "finish",
    // field: [41, 242, 31, 34],
    field: [95, 213, 22, 12],
    needCheck: (state) => {
      return state.state == "battle";
    },
    action: {
      type: "tap",
      data: [480, 180],
    },
    after: (state) => {
      if (state.state == "battle") {
        state.state = "finish";
        state.count++;
      }
    },
  },
] as Config[];
