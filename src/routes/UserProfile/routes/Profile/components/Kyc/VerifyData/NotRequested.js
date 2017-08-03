import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../constants/propTypes';

const NotRequested = props => (
  <div className="margin-bottom-10">
    <div className="font-size-18 font-weight-700 color-secondary">
      <i className="fa fa-check-circle-o" /> {' '}
      {I18n.t('PLAYER_PROFILE.PROFILE.KYC_VERIFICATION.TYPE_NOT_REQUESTED', { title: props.title })}
    </div>
  </div>
);
NotRequested.propTypes = {
  title: PropTypes.string.isRequired,
};

export default NotRequested;
