import React from 'react';
import { v4 } from 'uuid';
import FilterField from './FilterField';

const mapFilter = (element) => {
  const { label, size, type, placeholder, disabled, children, onFieldChange } = element.props;
  const childrenList = React.Children
    .toArray(children)
    .filter(child => child.type === FilterField);

  const filter = {
    uuid: v4(),
    label,
    size,
    type,
    placeholder,
    disabled,
    onFieldChange,
    default: element.props.default,
    inputs: childrenList.map(child => ({ ...child.props, key: child.props.name })),
  };
  filter.name = filter.inputs.reduce((res, input) => [res, input.name].filter(n => n).join('/'), null);

  return filter;
};

const getCurrentFilters = (array, props) => array
  .filter(filter => filter.default || props.selectedFilters.indexOf(filter.name) > -1)
  .sort((a, b) => {
    if (a.default && b.default) {
      return 0;
    } if (a.default && !b.default) {
      return -1;
    } if (!a.default && b.default) {
      return 1;
    }

    const aIndex = props.selectedFilters.indexOf(a.name);
    const bIndex = props.selectedFilters.indexOf(b.name);

    return aIndex < bIndex ? -1 : 1;
  });

export {
  mapFilter,
  getCurrentFilters,
};
