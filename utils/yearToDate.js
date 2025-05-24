function dayOfYearToDate(year, dayOfYear) {
  const date = new Date(year, 0, dayOfYear);
  return date.toISOString().slice(0, 10);
}

module.exports = { dayOfYearToDate };
