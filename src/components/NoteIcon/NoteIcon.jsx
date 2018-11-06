import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './NoteIcon.scss';

const NoteIcon = ({ type, className }) => (
  <i className={classNames(`note-icon note-icon-${type}`, className)} />
);

NoteIcon.propTypes = {
  type: PropTypes.oneOf([
    'new', 'filled', 'pinned',
  ]).isRequired,
  className: PropTypes.string,
};
NoteIcon.defaultProps = {
  className: null,
};

export default NoteIcon;
