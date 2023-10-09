// Function to remove query parameters
export function removeQueryParameters(url) {
  const indexOfQuestionMark = url.indexOf("?");
  if (indexOfQuestionMark !== -1) {
    return url.substring(0, indexOfQuestionMark);
  }
  return url;
}
