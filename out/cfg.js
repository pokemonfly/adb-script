"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        name: "开始行动",
        file: "1.png",
        field: [1916, 965, 2088, 1010],
        needCheck: (state) => {
            return state.state == "menu";
        },
        before: (state) => {
            if (state.count > state.loopCount) {
                return false;
            }
        },
        action: {
            type: "tap",
            data: [0, 0],
        },
        after: (state) => {
            state.state = "menu";
        },
    },
];
//# sourceMappingURL=cfg.js.map