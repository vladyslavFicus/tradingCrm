import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const LetterIcon = ({ color, letter }) => (
  <div className={classNames('letters-icon', color)}>
    {letter}
  </div>
);

LetterIcon.propTypes = {
  color: PropTypes.string.isRequired,
  letter: PropTypes.string.isRequired,
};

export default LetterIcon;
