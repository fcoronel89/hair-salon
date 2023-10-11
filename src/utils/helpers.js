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
}