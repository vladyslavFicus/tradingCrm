import React, { PureComponent } from 'react';
import { getBrand } from 'config';
import PropTypes from 'constants/propTypes';
import withModals from 'hoc/withModals';
import { Button } from 'components/UI';
import SmsSendModal from './modals/SmsSendModal';
import './Sms.scss';

class Sms extends PureComponent {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['PROFILE', 'LEAD']).isRequired,
    modals: PropTypes.shape({
      smsSendModal: PropTypes.modalType.isRequired,
    }).isRequired,
  };

  render() {
    const {
      uuid,
      field,
      type,
      modals: {
        smsSendModal,
      },
    } = this.props;

    const { isActive } = getBrand().sms.coperato;

    return (
      <If condition={isActive}>
        <Button
          className="Sms__button"
          onClick={
            () => smsSendModal.show({
              uuid,
              field,
              type,
            })
          }
        >
          SMS
        </Button>
      </If>
    );
  }
}

export default withModals({
  smsSendModal: SmsSendModal,
})(Sms);
