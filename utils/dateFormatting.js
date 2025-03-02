const monthNames = [
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
  "Dec",
];
const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function timestampToDate(timestamp) {
  let time = Number(timestamp);
  if (typeof time === typeof 1) {
    let [hour, minute, second] = new Date(time)
      .toLocaleTimeString("en-US", { hour12: false })
      .split(/:| /);
    let [month, day, year] = new Date(time)
      .toLocaleDateString("en-US")
      .split("/");
    const dayName = new Date(time).toLocaleString("en-us", { weekday: "long" });
    return {
      hour,
      minute,
      second,
      month,
      monthName: monthNames[month - 1],
      day,
      dayName,
      year,
    };
  } else {
    console.error(
      "ERROR, DATE IS NOT IN THE NUMBER FORMAT",
      typeof timestamp,
      timestamp,
    );
  }
}

function populateDate(item) {
  let evalutedItem = [];
  /* Item is array */
  if (Array.isArray(item)) {
    for (let i = 0; i < item.length; i++) {
      const dateProps = timestampToDate(item[i].timestamp);
      evalutedItem.push({
        ...item[i],
        date: dateProps,
      });
    }
  } else {
    /* Not array so object */
    evalutedItem = { ...item, date: timestampToDate(item.timestamp) };
  }
  return evalutedItem;
}

module.exports = populateDate;
