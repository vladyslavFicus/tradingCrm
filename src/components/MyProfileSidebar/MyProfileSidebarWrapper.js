import React from 'react';
import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
import MyProfileSidebar from './MyProfileSidebar';

const MyProfileSidebarWrapper = props => (
  <aside className={classNames(
    { 'my-profile__wrapper': props.isOpen }
  )}
  >
    <MyProfileSidebar {...props} />
  </aside>
);

MyProfileSidebarWrapper.propTypes = {
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onToggleProfile: PropTypes.func.isRequired,
};

export default MyProfileSidebarWrapper;
