import React from 'react';
import PropTypes from '../../constants/propTypes';
import MyProfileSidebar from './MyProfileSidebar';

const MyProfileSidebarWrapper = props => (
  <aside className="my-profile__wrapper">
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
