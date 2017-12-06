import React from 'react';
import PropTypes from 'prop-types';

const FieldLabel = (props) => {
  const {
    label,
    labelClassName,
    addon,
    wrapperTag,
    wrapperClassName,
  } = props;

  if (!label) {
    return null;
  }

  const Wrapper = wrapperTag;
  const node = <label className={labelClassName}>{label}{addon}</label>;

  return !Wrapper
    ? node
    : <Wrapper className={wrapperClassName}>{node}</Wrapper>;
};
FieldLabel.propTypes = {
  label: PropTypes.string,
  addon: PropTypes.element,
  labelClassName: PropTypes.string,
  wrapperTag: PropTypes.string,
  wrapperClassName: PropTypes.string,
};
FieldLabel.defaultProps = {
  label: null,
  addon: null,
  labelClassName: '',
  wrapperTag: null,
  wrapperClassName: '',
};

export default FieldLabel;
