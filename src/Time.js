const parseTime = (timestamp) => {
  const ampm = timestamp.toDate().getHours() < 12 ? "AM" : "PM";
  const hoursShift = (timestamp.toDate().getHours() + 12) % 12;
  const hours = hoursShift === 0 ? 12 : hoursShift;
  const minutes =
    timestamp.toDate().getMinutes() < 10
      ? "0" + timestamp.toDate().getMinutes()
      : timestamp.toDate().getMinutes();
  return hours + ":" + minutes + " " + ampm;
};

const parseDate = (timestamp) => {
  return (
    timestamp.toDate().getDate() +
    "." +
    timestamp.toDate().getMonth() +
    "." +
    (timestamp.toDate().getFullYear() - 2000)
  );
};

const parsePast = (timestamp, now) => {
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const timeDiff = now.seconds - timestamp.seconds;
  if (timeDiff < minute) {
    return "just now";
  }
  if (timeDiff < minute * 2) {
    return "1 minute";
  }
  if (timeDiff < hour) {
    return Math.floor(timeDiff / minute) + " minutes";
  }
  if (timeDiff < hour * 2) {
    return "1 hour";
  }
  if (timeDiff < day) {
    return Math.floor(timeDiff / hour) + " hours";
  }
  return parseDate(timestamp);
};

const dayEquality = (timestamp, now) => {
  if (
    timestamp.toDate().getDate() === now.toDate().getDate() &&
    timestamp.toDate().getMonth() === now.toDate().getMonth() &&
    timestamp.toDate().getFullYear() === now.toDate().getFullYear()
  ) {
    return true;
  } else {
    return false;
  }
};

export { parseTime, parseDate, parsePast, dayEquality };
