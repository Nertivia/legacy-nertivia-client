export default (miliseconds) => {
    let friendlyDate = "";
    const now = new Date();
    const messageDate = new Date(miliseconds);
    
    if (sameDay(now, messageDate)) {
        friendlyDate = `Today at ${getFullTime(messageDate)}`
    } else if (yesterDay(now, messageDate)) {
        friendlyDate = `Yesterday at ${getFullTime(messageDate)}`
    } else {
        friendlyDate = getFullDateWithTime(messageDate)
    }
    return friendlyDate;
}

function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
}
function yesterDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    (d1.getDate() - d2.getDate()) == 1
}

function getFullTime(date){
    let finalTime = ""
    let hours = date.getHours();
    let minutes = date.getMinutes()

    if (hours <= 9) {
        finalTime = `0${hours}`;
    } else {
        finalTime = `${hours}`
    }
    
    if (minutes <= 9) {
        finalTime += `:0${minutes}`;
    } else {
        finalTime += `:${minutes}`
    }
    return finalTime;
}

function getFullDateWithTime(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    return `${dayName} ${date.getDate()} ${monthName} ${date.getFullYear()} at ${getFullTime(date)}`
    
}