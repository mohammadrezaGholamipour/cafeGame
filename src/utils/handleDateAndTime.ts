export const handleDate = (dateString: Date) => {
  const date = new Date(dateString);
  const today = new Date();
  if (isToday(date, today)) {
    return "امروز";
  } else if (isYesterday(date, today)) {
    return "دیروز";
  } else {
    return formatDate(date);
  }
};
/////////////////////////////////
const isToday = (date: Date, today: Date) => {
  return date.toDateString() === today.toDateString();
};
/////////////////////////////////
const isYesterday = (date: Date, today: Date) => {
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};
/////////////////////////////////
const formatDate = (date: Date) => {
  return date.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    calendar: "persian",
  });
};
/////////////////////////////////////
export const handleTime = (dateString: Date) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    calendar: "persian",
  });
};