import React from 'react';
import Header from '../components/Header';
import Information from '../components/Information';
import Settings from '../components/Settings';
import HideDetails from '../../../../../components/HideDetails';

const ViewLayout = () => (
  <div className="profile">
    <div className="profile__info">
      <Header />
      <HideDetails>
        <Information />
      </HideDetails>
    </div>
    <Settings />
  </div>
);

export default ViewLayout;
