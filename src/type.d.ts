type Action = {
  type?: "tap" | "swipe";
  data?: number[];
  delay?: number
};

type Config = {
  name: string;
  file: string;
  field: number[];
  needCheck: (state) => boolean;
  before?: (state) => boolean;
  action: Action;
  after?: (state) => void;
};
