import localStorageService from "@/utils/local-storage-service";
import { driver, type DriveStep } from "driver.js";
import type { highlight } from "@/types/index";
/////////////////////////////
export const run = driver({
  showProgress: false,
  allowClose: false,
  nextBtnText: "بعدی",
  doneBtnText: "پایان",
  prevBtnText: "قبلی",
  stagePadding: 3,
});
/////////////////////////////////
export const consolePageStep = (step?: number) => {
  const elementList = new Set();
  const consolePageStep: DriveStep[] = [];
  const addStepIfElementExists = (element: string, popover: highlight) => {
    if (document.querySelector(element) !== null && !elementList.has(element)) {
      elementList.add(element);
      consolePageStep.push({
        element,
        popover,
        onDeselected: () => {
          if (run.isLastStep()) {
            const highlight: string[] = localStorageService.getHighlight();
            highlight.push("console");
            localStorageService.setHighlight(highlight);
          }
        },
      });
    }
  };
  addStepIfElementExists("#new", {
    title: "انتخاب کنید",
    description: "اولین دستگاه خود را ایجاد کنید",
    showButtons: [],
  });

  addStepIfElementExists("#display-console", {
    title: "تغییر مدل نمایش",
    description: "ظاهر دلخواد خود را انتخاب کنید",
    showButtons: ["next"],
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
  run.destroy();
  run.setSteps(consolePageStep);
  run.drive(step);
};

