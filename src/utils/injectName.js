export const injectName = (firstName, lastName, text) => text
  .replace(/{firstName}/, firstName)
  .replace(/{lastName}/, lastName);
