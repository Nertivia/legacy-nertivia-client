export default (miliseconds, type) => {
  let friendlyDate = "";
  const now = new Date();
  const messageDate = new Date(miliseconds);

  if (sameDay(now, messageDate)) {
    friendlyDate = `Today at ${getFullTime(messageDate, type)}`;
  } else if (yesterDay(messageDate)) {
    friendlyDate = `Yesterday at ${getFullTime(messageDate, type)}`;
  } else {
    friendlyDate = getFullDateWithTime(messageDate, type);
  }
  return friendlyDate;
};

export function time(miliseconds, type) {
  const messageDate = new Date(miliseconds);
  return getFullTime(messageDate, type);
}
function sameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
function yesterDay(date) {
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return sameDay(yesterday, date)
}

function getFullTime(date, type) {
  if (type === "12h") {
    return formatAMPM(date);
  }
  let finalTime = "";
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (hours <= 9) {
    finalTime = `0${hours}`;
  } else {
    finalTime = `${hours}`;
  }

  if (minutes <= 9) {
    finalTime += `:0${minutes}`;
  } else {
    finalTime += `:${minutes}`;
  }
  return finalTime;
}

function getFullDateWithTime(date, type) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  return `${dayName} ${date.getDate()} ${monthName} ${date.getFullYear()} at ${getFullTime(
    date,
    type
  )}`;
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}
