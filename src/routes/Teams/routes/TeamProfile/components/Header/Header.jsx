import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../constants/propTypes';
import Uuid from '../../../../../../components/Uuid';
import ProfileHeaderPlaceholder from '../../../../../../components/ProfileHeaderPlaceholder';

class Header extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    modals: PropTypes.shape({
      addOperatorModal: PropTypes.modalType,
    }).isRequired,
  };

  static defaultProps = {
    data: {},
  };

  handleOpenManagerModal = () => {
    const {
      data: { name, uuid, branchType },
      modals: { addOperatorModal },
    } = this.props;

    addOperatorModal.show({
      renderTopContent: (
        <div className="row mb-3">
          <div className="col text-center font-weight-700">
            {I18n.t('MODALS.ADD_OPERATOR_TO_BRANCH.ADD_TO_TEAM', { branch: name })}
          </div>
        </div>
      ),
      branch: { uuid, name, branchType },
    });
  };

  render() {
    const {
      data: {
        uuid,
        name,
        country,
      },
      loading,
    } = this.props;

    return (
      <div className="row no-gutters panel-heading-row">
        <ProfileHeaderPlaceholder ready={!loading}>
          <div className="panel-heading-row__info">
            <div className="panel-heading-row__info-title">
              {name}
            </div>
            <span className="panel-heading-row__info-ids">
              {!!uuid && <Uuid uuid={uuid} uuidPrefix="TE" />} {country && ` - ${country}`}
            </span>
          </div>
        </ProfileHeaderPlaceholder>
        <div className="panel-heading-row__actions">
          <button
            type="button"
            className="btn btn-default-outline mx-3"
            onClick={this.handleOpenManagerModal}
            disabled={loading}
          >
            {I18n.t('COMMON.ADD_MANAGER_TO_BRANCH')}
          </button>
        </div>
      </div>
    );
  }
}

export default Header;
