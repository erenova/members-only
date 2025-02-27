const monthNames = [
  "Jan",
  "Febr",
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

function getDate(timestamp) {
  timestamp = Number(timestamp);
  if (typeof timestamp === typeof 15) {
    let [hour, minute, second] = new Date(timestamp)
      .toLocaleTimeString("en-US")
      .split(/:| /);
    let [month, day, year] = new Date(timestamp)
      .toLocaleDateString("en-US")
      .split("/");

    return {
      hour,
      minute,
      second,
      month,
      monthName: monthNames[month],
      day,
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

module.exports = getDate;
