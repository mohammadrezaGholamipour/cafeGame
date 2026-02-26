<script setup lang="ts">
import { usePinia } from "@/store/pinia";
import billApi from "@/api/bill.js";
import { computed } from "vue";
import type { billFood, food, foodStore } from "@/types";

declare var webkitSpeechRecognition: any;
const pinia = usePinia();

const baseNumbers: Record<string, number> = {
  صفر: 0,
  یک: 1,
  یه: 1,
  دو: 2,
  سه: 3,
  چهار: 4,
  پنج: 5,
  شش: 6,
  هفت: 7,
  هشت: 8,
  نه: 9,
  ده: 10,
};

function normalize(text: string) {
  const persianNumbers: Record<string, string> = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };
  text = text.replace(/[۰-۹]/g, (d) => persianNumbers[d] || d);
  text = text
    .replace(/\u200c/g, " ")
    .toLowerCase()
    .trim();

  Object.entries(baseNumbers).forEach(([word, value]) => {
    const wordRegex = new RegExp(`(^|\\s)${word}(?=\\s|$)`, "gi");
    text = text.replace(wordRegex, `$1${value}`);

    const taRegex = new RegExp(`(^|\\s)${word}\\s*تا(?=\\s|$)`, "gi");
    text = text.replace(taRegex, `$1${value} تا`);
  });

  text = text.replace(/\b(\d+)تا\b/gi, "$1 تا");

  return text;
}

function extractItem(normalizedText: string) {
  const foodNames = pinia.state.food.map((item: any) => item.name);
  for (const it of foodNames.sort((a, b) => b.length - a.length)) {
    const pattern = normalize(it).replace(/\s+/g, "\\s+");
    const regex = new RegExp(`(^|\\s)${pattern}(?=\\s|$)`, "i");
    if (regex.test(normalizedText)) return it;
  }
  return null;
}

function parseVoiceCommand(text: string) {
  let normalizedText = normalize(text);

  // ---------- DEVICE ----------
  let device: number | null = null;
  const deviceRegex = /(دستگاه|سیستم|کنسول)\s*(شماره)?\s*(\d+)/i;
  const deviceMatch = normalizedText.match(deviceRegex);
  if (deviceMatch) {
    device = parseInt(deviceMatch[3]);
    normalizedText = normalizedText.replace(deviceRegex, "").trim();
  }

  const item = extractItem(normalizedText);
  if (!item || device === null) return null;

  let quantity: number | null = null;

  const itemPattern = normalize(item).replace(/\s+/g, "\\s+");
  const quantityRegex = new RegExp(
    `(\\d+)\\s*(تا|عدد)?\\s+${itemPattern}`,
    "i",
  );
  const match = normalizedText.match(quantityRegex);
  if (match) quantity = parseInt(match[1]);
  if (quantity === null) return null;

  if (device && quantity && item) return { device, quantity, item };
  else return null;
}

const handleVoiceCommand = () => {
  if (!("webkitSpeechRecognition" in window)) {
    pinia.handleNotification({
      ...pinia.state.notification,
      name: "error",
      status: true,
      textHeader: "خطا",
      textMain: "سیستم شما اجازه  باز کردن میکرفون را نمیدهد",
    });
  } else {
    const recognition = new webkitSpeechRecognition();

    recognition.lang = "fa-IR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const outPut = parseVoiceCommand(transcript);
      console.log(transcript);
      console.log(outPut);
      if (outPut) handleFood(outPut);
      else {
        pinia.handleNotification({
          ...pinia.state.notification,
          timer: 2000,
          name: "error",
          status: true,
          textHeader: "خوراکی ثبت نشد",
        });
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        pinia.handleNotification({
          ...pinia.state.notification,
          timer: 6000,
          name: "error",
          status: true,
          textHeader: "دسترسی میکروفون",
          textMain:
            "برای استفاده از دستور صوتی ابتدا باید به میکرفون برای فعال شدن دسترسی بدهید",
        });
      }

      if (event.error === "audio-capture") {
        pinia.handleNotification({
          ...pinia.state.notification,
          name: "error",
          status: true,
          textHeader: "میکروفون یافت نشد",
          textMain: "هیچ میکروفونی روی دستگاه شما شناسایی نشد",
        });
      }
    };

    recognition.start();
  }
};

const handleFood = (outPut: any) => {
  const bill = pinia.state.openBill.find(
    (item: any) => Number(item.console.name) === outPut?.device,
  );
  let foodListSelected = bill?.bill_foods || [];
  if (Array.isArray(pinia.state.food)) {
    ///////////////////////////////
    const foodSelected = foodListSelected?.find((item: any) =>
      item.name == outPut.item ? (item.count = outPut?.quantity) : "",
    );
    if (foodSelected) {
      foodSelected.count = outPut?.quantity;
    } else {
      const foodSeledted = pinia.state.food.find(
        (item: any) => item.name === outPut?.item,
      );
      if (foodSeledted) {
        foodListSelected.push({
          food_id: foodSeledted?.id,
          count: outPut?.quantity,
        });
      }
    }
  } else {
    pinia.handleNotification({
      ...pinia.state.notification,
      name: "error",
      status: true,
      textHeader: "خطا",
      textMain: "لیست خوراکی ها خالی میباشد",
    });
  }

  if (bill?.id) requestSetFood(bill?.id, outPut?.device, foodListSelected);
  else {
    pinia.handleNotification({
      ...pinia.state.notification,
      name: "error",
      status: true,
      timer: 4000,
      textHeader: "خطا",
      textMain: `درحال حاظر فاکتور باز برای دستگاه شماره ${outPut?.device} وجود ندارد`,
    });
  }
};

const requestSetFood = (billId: number, consoleId: number, food: foodStore) => {
  handleConsoleLoading(consoleId, true);
  billApi
    .update(billId, { foods: food })
    .then(() => {
      pinia.requestGetOpenBill();
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "success",
        status: true,
        timer: 2000,
        textHeader: "موفق",
        textMain: `خوراکی ها اضافه شدند`,
      });
    })
    .catch((errors: any) => {
      pinia.handleNotification({
        ...pinia.state.notification,
        timer: 3000,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: `${errors?.response?.data?.error[0]?.message || "خطای نامشخص"}`,
      });
    })
    .finally(() => handleConsoleLoading(consoleId, false));
};

const homeData = computed(() => {
  if (Array.isArray(pinia.state.home) && Array.isArray(pinia.state.hourRate)) {
    if (pinia.state.home.length && pinia.state.hourRate.length) {
      return pinia.state.home;
    } else {
      return [];
    }
  }
});

const handleConsoleLoading = (consoleId: number, status: boolean) => {
  let console = homeData.value?.find((item) => item.consoleId === consoleId);
  if (console) console.loading = status;
};
</script>
<template>
  <div @click="handleVoiceCommand" class="voice-command">
    <p>دستور صوتی</p>
    <img class="animate-pulse" src="@/assets/image/header/voice-command.svg" />
  </div>
</template>
<style scoped>
.voice-command {
  @apply font-[dana] text-white flex gap-1 cursor-pointer;
}
</style>
