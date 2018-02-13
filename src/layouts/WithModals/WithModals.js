import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { types as modalsTypes } from '../../constants/modals';
import ConfirmActionModal from '../../components/Modal/ConfirmActionModal';

const WithModals = (WrappedComponent) => {
  class Wrapper extends PureComponent {
    static propTypes = {
      closeModal: PropTypes.func.isRequired,
      modal: PropTypes.shape({
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        params: PropTypes.object,
      }),
    };

    static defaultProps = {
      modal: {
        name: '',
        params: {},
      },
    };

    handleReloadPage = () => location.reload();

    render() {
      const { modal, closeModal } = this.props;

      return (
        <div>
          <WrappedComponent {...this.props} />
          {
            modal && modal.name === modalsTypes.NEW_API_VERSION &&
            <ConfirmActionModal
              onSubmit={this.handleReloadPage}
              onClose={closeModal}
              modalTitle={I18n.t('MODALS.NEW_API_VERSION.TITLE')}
              actionText={I18n.t('MODALS.NEW_API_VERSION.MESSAGE')}
            />
          }
        </div>
      );
    }
  }
  return Wrapper;
};

export default WithModals;
