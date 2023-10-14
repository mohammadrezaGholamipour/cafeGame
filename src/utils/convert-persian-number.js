String.prototype.getBaseConversionNumber = function (label) {
  const faDigits = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰'];
  const enDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const arDigits = ['٠', '٩', '٨', '٧', '٦', '٥', '٤', '٣', '٢', '١']
  var whichDigit = {};
  switch (label) {
    case 'fa':
      whichDigit[label] = faDigits;
      break;
    case 'en':
      whichDigit[label] = enDigits;
      break;
    case 'ar':
      whichDigit[label] = arDigits;
      break;
    case 'all':
      whichDigit = { "fa": faDigits, "en": enDigits, "ar": arDigits };
      break;
    default:
      whichDigit = [];
  }

  return whichDigit;
}
String.prototype.CvnFromTo = function (fromDigits, toDigits, str) {
  var str = str == undefined ? this : str;
  for (var i = 0; i < toDigits.length; i++) {
    const currentFromDigit = fromDigits[i];
    const currentToDigit = toDigits[i];
    const regex = new RegExp(currentFromDigit, 'g');
    str = str.replace(regex, currentToDigit);
  }
  return str;
}
String.prototype.convertDigits = function (to) {
  let str = this;
  const toCvn = (this.getBaseConversionNumber(to))[to];
  const allDigits = this.getBaseConversionNumber("all");

  delete allDigits[to];
  const Objkeys = Object.keys(allDigits);
  for (var i = 0; i < Objkeys.length; i++) {
    const currentKey = Objkeys[i];
    const fromCvn = allDigits[currentKey];
    str = this.CvnFromTo(fromCvn, toCvn, str)
  }
  return str;
}