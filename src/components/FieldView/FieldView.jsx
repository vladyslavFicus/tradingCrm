import React from 'react';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';

const FieldView = ({ label, value, onClick }) => (
  <div className="font-size-13">
    <span className="font-weight-700">{I18n.t(label)}: </span>
    {value}
    <i onClick={onClick} className="font-size-16 cursor-pointer fa fa-edit float-right" />
  </div>
);

FieldView.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.string]),
};

FieldView.defaultProps = {
  value: '',
  label: '',
};

export default FieldView;
