import React from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../../../../../../../../constants/propTypes';
import { stepStatuses } from './VerifyData';
import PermissionContent from '../../../../../../../../../components/PermissionContent';
import permissions from '../../../../../../../../../config/permissions';

const NotVerified = (props) => {
  const { step, title, onRefuse, onVerify, status } = props;

  const requestStatus = step === stepStatuses.WAITING_FOR_DOCUMENTS
    ? I18n.t('PLAYER_PROFILE.PROFILE.KYC_VERIFICATION.WAITING_FOR_DOCUMENTS')
    : I18n.t('PLAYER_PROFILE.PROFILE.KYC_VERIFICATION.PENDING');

  return (
    <div className="panel-body__content-container">
      <div className="panel-body__content">
        <div className="font-size-18 font-weight-700 color-warning">
          <i className="fa fa-exclamation-triangle" /> {' '}
          {I18n.t('PLAYER_PROFILE.PROFILE.KYC_VERIFICATION.TYPE_NOT_VERIFIED', { title })}
        </div>
        <div className="pt-4 font-size-11 color-default text-uppercase">
          {I18n.t('PLAYER_PROFILE.PROFILE.KYC_VERIFICATION.REQUEST_STATUS')}
        </div>
        <div className="color-primary font-size-16">
          {requestStatus}
        </div>
        <div className="font-size-11 color-default">
          {I18n.t('COMMON.SINCE', { date: moment.utc(status.statusDate).local().format('DD.MM.YYYY \\a\\t HH:mm') })}
        </div>
        <div className="font-size-12 pt-4">
          {I18n.t('PLAYER_PROFILE.PROFILE.KYC_VERIFICATION.WAITING_FOR_DOCS_DESCRIPTION')}
        </div>
      </div>

      <div className="panel-body__buttons">
        <PermissionContent permissions={permissions.USER_PROFILE.KYC_REJECT}>
          <button
            id={`refuse-${title.toLowerCase()}-button`}
            onClick={onRefuse}
            type="button"
            className="btn btn-danger-outline margin-right-10"
          >
            {I18n.t('PLAYER_PROFILE.PROFILE.KYC_VERIFICATION.ACTIONS.REFUSE')}
          </button>
        </PermissionContent>
        <PermissionContent permissions={permissions.USER_PROFILE.KYC_VERIFY}>
          <button
            id={`verify-${title.toLowerCase()}-button`}
            onClick={onVerify}
            type="button"
            className="btn btn-success-outline"
          >
            {I18n.t('PLAYER_PROFILE.PROFILE.KYC_VERIFICATION.ACTIONS.VERIFY')} {title.toLowerCase()}
          </button>
        </PermissionContent>
      </div>
    </div>
  );
};

NotVerified.propTypes = {
  status: PropTypes.kycStatus,
  title: PropTypes.string.isRequired,
  step: PropTypes.string.isRequired,
  onRefuse: PropTypes.func.isRequired,
  onVerify: PropTypes.func.isRequired,
};
NotVerified.defaultProps = {
  status: {},
};

export default NotVerified;
