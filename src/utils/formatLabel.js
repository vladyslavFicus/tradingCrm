export default (label) => {
  const lower = label.toLowerCase();
  const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

  return upper.replace('_', ' ');
};
