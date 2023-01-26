export const injectName = (firstName: string, lastName: string, text: string): string => (
  text.replace(/{firstName}/, firstName).replace(/{lastName}/, lastName)
);
