import keyMirror from 'keymirror';

const SIZES = keyMirror({
  small: null,
  medium: null,
  big: null,
});
const TYPES = {
  input: 'input',
  date: 'date',
  datetime: 'datetime',
  select: 'select',
  nas_select: 'nas:select',
  range_input: 'range:input',
  range_date: 'range:date',
  range_datetime: 'range:datetime',
};

export {
  SIZES,
  TYPES,
};
