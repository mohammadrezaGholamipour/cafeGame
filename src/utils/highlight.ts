import type { highlight, highlightStep } from "@/types/index";
import { driver } from "driver.js";
/////////////////////////////
export const consolePage = driver({
  showProgress: false,
  allowClose: false,
  nextBtnText: "بعدی",
  doneBtnText: "پایان",
  prevBtnText: "قبلی",
  stagePadding: 3,
});
/////////////////////////////////
export const handleConsolePageStep = () => {
  const consolePageStap: highlightStep[] = [];
  const addStepIfElementExists = (element: string, popover: highlight) => {
    if (document.querySelector(element) !== null) {
      consolePageStap.push({ element, popover });
    }
  };
  addStepIfElementExists("#tools", {
    title: "انتخاب کنید",
    description: "اولین دستگاه خود را ایجاد کنید",
  });

  addStepIfElementExists("#display-console", {
    title: "تغییر مدل نمایش",
    description: "ظاهر دلخواد خود را انتخاب کنید",
  });

  addStepIfElementExists(".console-timer", {
    title: "زمان بازی شده",
    description: "در این قسمت کل زمان بازی شده با این دستگاه را نشان میدهد",
  });

  addStepIfElementExists(".console-money", {
    title: "هزینه دریافت شده",
    description:
      "در این قسمت مجموع هزینه های دریافتی از بازی با این دستگاه نشان داده میشود",
  });

  addStepIfElementExists("#remove-console", {
    title: "حذف دستگاه",
    description:
      "لطفا توجه داشته باشید تنها در صورتی امکان حذف دستگاه وجود دارد که هیچ فاکتوری با ان ثبت نشده باشد به عبارتی ساده تر در صفحه اصلی از این دستگاه استفاده نشده باشد",
  });
  return consolePageStap;
};
