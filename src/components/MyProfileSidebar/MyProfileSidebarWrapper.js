import React from 'react';
import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
import MyProfileSidebar from './MyProfileSidebar';

const MyProfileSidebarWrapper = props => (
  <aside className={classNames({ 'my-profile-wrapper': props.isOpen })}>
    <MyProfileSidebar {...props} />
  </aside>
);

MyProfileSidebarWrapper.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onToggleProfile: PropTypes.func.isRequired,
};

export default MyProfileSidebarWrapper;
