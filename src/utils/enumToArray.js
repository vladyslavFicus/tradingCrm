// Turn enum into array
export default enumme => Object.keys(enumme)
  .filter(value => Number.isNaN(Number(value)) === false)
  .map(key => enumme[key]);
