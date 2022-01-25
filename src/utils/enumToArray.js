/**
 * Turn enum into array
 *
 * Example:
 *
 * enum MyEnum {
 *  Part1 = 0,
 *  Part2 = 1
 * }
 *
 * will be emitted as
 *
 * {
 *  Part1: 0,
 *  Part2: 1,
 *  0: 'Part1',
 *  1: 'Part2'
 * }
 *
 * So you should filter the object first before mapping.
 *
 * Use it like this:
 *
 * enumToArray(MyEnum).map(value => (
 * <option key={value} value={value}>
 *  {value}
 * </option>
 * ))
 */
export default enumme => Object.keys(enumme)
  .filter(value => !!Number.isNaN(+value))
  .map(key => enumme[key]);
