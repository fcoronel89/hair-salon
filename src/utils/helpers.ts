export const apiUrl: string = import.meta.env.VITE_BACKEND_URL as string;

// Remove query parameters from a URL
export function removeQueryParameters(url: string): string {
  // Find the index of the question mark in the URL
  const indexOfQuestionMark = url.indexOf("?");

  // If the question mark exists in the URL
  if (indexOfQuestionMark !== -1) {
    // Return the substring of the URL before the question mark
    return url.substring(0, indexOfQuestionMark);
  }

  // If the question mark does not exist in the URL, return the original URL
  return url;
}

// Get the date object for yesterday
export const getYesterdayDate = (): Date => {
  // Get the current date object
  const currentDate = new Date();

  // Calculate the number of milliseconds in one day
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

  // Subtract one day from the current date to get the previous date
  const previousDate = new Date(currentDate.getTime() - oneDayInMilliseconds);

  // Return the previous date
  return previousDate;
};

// Get the date object in the local timezone
export const getDateInLocalTimezone = (date: Date): Date => {
  // Create a new date object from the input date
  const originalDate = new Date(date);

  // Create a new date object with the same time as the original date
  const dateObject = new Date(originalDate);

  // Add 3 hours to the date object to convert it to the local timezone
  dateObject.setHours(originalDate.getHours() + 3);

  // Return the date object in the local timezone
  return dateObject;
};

// Combine a date object and a time string into a single date object
export const getCombinedDateTime = (date: Date, timeString: string): Date => {
  // Get the date object in the local timezone
  const dateObject = getDateInLocalTimezone(date);

  // Get the year, month, and day from the date object
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth();
  const day = dateObject.getDate();

  // Split the time string into hours and minutes
  const [hours, minutes] = timeString.split(":").map(Number);

  // Create a new date object with the combined date and time
  return new Date(year, month, day, hours, minutes);
};

// Add minutes to a date object
export const addMinutesToDate = (date: Date, minutesToAdd: number): Date => {
  // Calculate the number of milliseconds to add based on the number of minutes
  const millisecondsToAdd = minutesToAdd * 60000;

  // Add the milliseconds to the date object to get the new date
  return new Date(date.getTime() + millisecondsToAdd);
};
