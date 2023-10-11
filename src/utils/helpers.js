// Function to remove query parameters
export function removeQueryParameters(url) {
  const indexOfQuestionMark = url.indexOf("?");
  if (indexOfQuestionMark !== -1) {
    return url.substring(0, indexOfQuestionMark);
  }
  return url;
}

export const getYesterdayDate = () => {
  const currentDate = new Date();
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  const previousDate = new Date(currentDate.getTime() - oneDayInMilliseconds);
  return previousDate;
};

export const getCombinedDateTime = (dateString, timeString) => {
  const dateObject = new Date(dateString + 'T00:00:00-03:00'); // '-03:00' represents argentina timezone
  // Extract date components
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth();
  const day = dateObject.getDate();

  // Extract time components
  const [hours, minutes] = timeString.split(":").map(Number);

  // Combine date and time into a single Date object
  return new Date(year, month, day, hours, minutes);
};

export const addMinutesToDate = (date, minutesToAdd) => {
  return new Date(date.getTime() + minutesToAdd * 60000);
};
