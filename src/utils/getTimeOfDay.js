export default ([MORNING, AFTERNOON, EVENING, NIGHT]) => {
  const hour = new Date().getHours();

  if (hour > 23 || hour < 4) {
    return NIGHT;
  } if (hour > 3 && hour < 12) {
    return MORNING;
  } if (hour > 11 && hour < 17) {
    return AFTERNOON;
  }

  return EVENING;
};
