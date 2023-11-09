import localStorageService from "@/utils/local-storage-service";
import { driver, type DriveStep } from "driver.js";
import type { highlight } from "@/types/index";
/////////////////////////////
export const highlighter = driver({
  showProgress: false,
  allowClose: false,
  nextBtnText: "بعدی",
  doneBtnText: "پایان",
  prevBtnText: "قبلی",
  stagePadding: 3,
});

/////////////////////////////////
export const consolePageStep = (step?: number) => {
  const highlight = localStorageService.getHighlight();
  if (!highlight.includes("console")) {
    const elementList = new Set();
    const consolePageStep: DriveStep[] = [];
    const addStep = (element: string, popover: highlight) => {
      if (
        document.querySelector(element) !== null &&
        !elementList.has(element)
      ) {
        elementList.add(element);
        consolePageStep.push({
          element,
          popover,
          onDeselected: () => {
            if (highlighter.isLastStep()) {
              const highlight: string[] = localStorageService.getHighlight();
              if (!highlight.includes("console")) {
                highlight.push("console");
                localStorageService.setHighlight(highlight);
              }
            }
          },
        });
      }
    };
    addStep("#new", {
      title: "انتخاب کنید",
      description: "اولین دستگاه خود را ایجاد کنید",
      showButtons: [],
    });

    addStep("#display-console", {
      title: "تغییر مدل نمایش",
      description: "ظاهر دلخواد خود را انتخاب کنید",
      showButtons: ["next"],
    });

    addStep(".console-timer", {
      title: "زمان بازی شده",
      description: "در این قسمت کل زمان بازی شده با این دستگاه را نشان میدهد",
    });

    addStep(".console-money", {
      title: "هزینه دریافت شده",
      description:
        "در این قسمت مجموع هزینه های دریافتی از بازی با این دستگاه نشان داده میشود",
    });

    addStep("#remove-console", {
      title: "حذف دستگاه",
      description:
        "لطفا توجه داشته باشید تنها در صورتی امکان حذف دستگاه وجود دارد که هیچ فاکتوری با ان ثبت نشده باشد به عبارتی ساده تر در صفحه اصلی از این دستگاه استفاده نشده باشد",
    });
    highlighter.destroy();
    highlighter.setSteps(consolePageStep);
    highlighter.drive(step);
  }
};
///////////////////////////////
export const foodPageStep = (step?: number) => {
  const highlight = localStorageService.getHighlight();
  if (!highlight.includes("food")) {
    const elementList = new Set();
    const consolePageStep: DriveStep[] = [];
    const addStep = (element: string, popover: highlight) => {
      if (
        document.querySelector(element) !== null &&
        !elementList.has(element)
      ) {
        elementList.add(element);
        consolePageStep.push({
          element,
          popover,
          onDeselected: () => {
            if (highlighter.isLastStep()) {
              const highlight: string[] = localStorageService.getHighlight();
              if (!highlight.includes("food")) {
                highlight.push("food");
                localStorageService.setHighlight(highlight);
              }
            }
          },
        });
      }
    };
    addStep("#new", {
      title: "انتخاب کنید",
      description: "اولین خوراکی خود را ایجاد کنید",
      showButtons: [],
    });
    addStep("#edit", {
      title: "تغییر خوراکی",
      description:
        "با فشار دادن این دکمه شما میتوانید نام و قیمت خوراکی را تغییر دهید برای مثال نام خوراکی را اشتباه نوشته اید و یا قیمت خوراکی افزایش پیدا کرده باشد شما توانایی تغییر ان را دارید",
      showButtons: ["next"],
    });
    addStep("#remove", {
      title: "حذف خوراکی",
      description:
        "شما میتوانید خوراکی مورد نظر خود را حذف کنید البته تنها در صورتی توانایی حذف ان را دارید که که در فاکتوری از ان استفاده نکرده باشید ",
    });
    highlighter.destroy();
    highlighter.setSteps(consolePageStep);
    highlighter.drive(step);
  }
};
