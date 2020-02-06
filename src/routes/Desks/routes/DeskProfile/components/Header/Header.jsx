import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import ProfileHeaderPlaceholder from 'components/ProfileHeaderPlaceholder';
import Uuid from 'components/Uuid';

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
            {I18n.t('MODALS.ADD_OPERATOR_TO_BRANCH.ADD_TO_DESK', { branch: name })}
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
              {!!uuid && <Uuid uuid={uuid} uuidPrefix="DE" />} {country && ` - ${country}`}
            </span>
          </div>
        </ProfileHeaderPlaceholder>
        <PermissionContent permissions={permissions.HIERARCHY.UPDATE_USER_BRANCH}>
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
        </PermissionContent>
      </div>
    );
  }
}

export default Header;
