export const filterNumbers = (str) => {
  if (typeof str === "undefined" || str === null) str = "";
  str = str.toString().convertDigits("en").replace(/\D+/g, "");
  str = parseInt(str);
  return str === 0 | str ? str : '';
};
export const filterNumbersWithSep = (str, zero = false) => {
  if (typeof str === "undefined" || str === null) str = "";
  else
    str = str
      .toString()
      .convertDigits("en")
      .replace(/[^0-9,]*/g, "")
      .replace(/^0+/g, "")
      .replace(/(,*)/g, "")
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  return zero && str == "" ? "0" : str;
};
export const filterCodeMelliAndPhone = (str) => {
  if (typeof str === "undefined" || str === null) str = "";
  str = str.toString().convertDigits("en").replace(/\D+/g, "");
  return str
};