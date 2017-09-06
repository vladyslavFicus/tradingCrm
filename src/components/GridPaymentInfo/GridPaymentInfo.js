import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import { types as miniProfileTypes } from '../../constants/miniProfile';
import { shortify } from '../../utils/uuid';
import Uuid from '../Uuid';
import MiniProfile from '../../components/MiniProfile';

class GridPaymentInfo extends Component {
  static propTypes = {
    payment: PropTypes.paymentEntity.isRequired,
    onClick: PropTypes.func.isRequired,
  };
  static contextTypes = {
    miniProfile: PropTypes.shape({
      onShowMiniProfile: PropTypes.func.isRequired,
    }),
  };

  onMiniProfileHover = (target, params, type) => {
    this.context.miniProfile.onShowMiniProfile(`id-${target}`, params, type);
  }

  render() {
    const { payment, onClick } = this.props;

    let uuidPrefix = null;

    if (payment.creatorUUID.indexOf('OPERATOR') === -1) {
      uuidPrefix = payment.creatorUUID.indexOf('PLAYER') === -1 ? 'PL' : null;
    }

    return (
      <div id={`payment-${payment.paymentId}`}>
        <div className="font-weight-700">
          <button
            className="btn-transparent-text"
            onClick={onClick}
            id={`transaction-${payment.paymentId}`}
          >
            {shortify(payment.paymentId, 'TA')}
          </button>
        </div>
        <div className="font-size-11">
          {I18n.t('COMMON.AUTHOR_BY')}
          {' '}
          <MiniProfile
            target={payment.paymentId}
            onMouseOver={() => this.onMiniProfileHover(payment.paymentId, payment, miniProfileTypes.TRANSACTION)}
          >
            <Uuid
              uuid={payment.creatorUUID}
              uuidPrefix={uuidPrefix}
            />
          </MiniProfile>
        </div>
      </div>
    );
  }
}

export default GridPaymentInfo;
