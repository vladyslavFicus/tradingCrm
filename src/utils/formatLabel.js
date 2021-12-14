export default (label, lowerise = true) => {
  const _label = lowerise ? label.toLowerCase() : label;
  const upper = _label.charAt(0).toUpperCase() + _label.substring(1);

  return upper.replace(/_/g, ' ');
};
