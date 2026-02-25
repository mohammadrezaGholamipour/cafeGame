export const handleDate = (isoString: string) => {

  const dateUTC = new Date(isoString);

  const dateTehran = new Date(dateUTC.getTime() + 3.5 * 60 * 60 * 1000);

  const now = new Date();
  const nowTehran = new Date(now.getTime() + 3.5 * 60 * 60 * 1000);


  const dateDay = dateTehran.getDate();
  const dateMonth = dateTehran.getMonth();
  const dateYear = dateTehran.getFullYear();

  const nowDay = nowTehran.getDate();
  const nowMonth = nowTehran.getMonth();
  const nowYear = nowTehran.getFullYear();

  const yesterday = new Date(nowTehran);
  yesterday.setDate(nowTehran.getDate() - 1);
  const yesterdayDay = yesterday.getDate();
  const yesterdayMonth = yesterday.getMonth();
  const yesterdayYear = yesterday.getFullYear();

  if (dateDay === nowDay && dateMonth === nowMonth && dateYear === nowYear) return "امروز";
  if (dateDay === yesterdayDay && dateMonth === yesterdayMonth && dateYear === yesterdayYear) return "دیروز";

  return `${dateYear}/${dateMonth + 1}/${dateDay}`;
};

export const handleTime = (isoString: string) => {
  const dateUTC = new Date(isoString);
  const dateTehran = new Date(dateUTC.getTime() + 3.5 * 60 * 60 * 1000);

  const hours = dateTehran.getHours().toString().padStart(2, "0");
  const minutes = dateTehran.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

