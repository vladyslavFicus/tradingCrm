import React from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import Uuid from '../../../../../../../components/Uuid';
import PropTypes from '../../../../../../../constants/propTypes';

const Verified = (props) => {
  const { title, onRefuse, status } = props;

  return (
    <div>
      <div className=" margin-bottom-10">
        <div className="font-size-18 font-weight-700 color-success">
          <i className="fa fa-check-circle-o" /> {' '}
          {I18n.t('PLAYER_PROFILE.PROFILE.KYC_VERIFICATION.TYPE_VERIFIED', { title })}
        </div>
        <div className="font-size-11 color-default ">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={status.authorUUID} />
          {I18n.t('COMMON.DATE_ON', { date: moment(status.statusDate).format('DD.MM.YYYY \\a\\t HH:mm:ss') })}
        </div>
      </div>

      <div className=" margin-top-50 text-right">
        <button
          onClick={onRefuse}
          type="button"
          className="btn btn-danger-outline "
        >
          {I18n.t('PLAYER_PROFILE.PROFILE.KYC_VERIFICATION.ACTIONS.REVOKE')}
        </button>
      </div>
    </div>
  );
};

Verified.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.kycStatus.isRequired,
  onRefuse: PropTypes.func.isRequired,
};

export default Verified;
