import { driver } from "driver.js";
///////////////////////////////////
const run = driver();
export const highlight = {
  consolePage: () =>
    run.highlight({
      element: "#tools",
      popover: {
        description: "با فشار دادن این دکمه اولین دستگاه خود را ایجاد کنید",
      },
    }),
};
