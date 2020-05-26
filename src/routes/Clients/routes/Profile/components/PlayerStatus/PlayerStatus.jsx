import React, { PureComponent } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { getActiveBrandConfig } from 'config';
import { withPermission } from 'providers/PermissionsProvider';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import { fsaStatuses } from 'constants/fsaMigration';
import { statuses, statusColorNames, statusesLabels } from 'constants/user';
import FailureReasonIcon from 'components/FailureReasonIcon';
import Uuid from 'components/Uuid';
import renderLabel from 'utils/renderLabel';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import PlayerStatusModal from './PlayerStatusModal';

const changeStatusPermissions = new Permissions(permissions.USER_PROFILE.STATUS);

class PlayerStatus extends PureComponent {
  static propTypes = {
    playerUUID: PropTypes.string.isRequired,
    status: PropTypes.oneOf(Object.keys(statuses)),
    reason: PropTypes.string,
    availableStatuses: PropTypes.array.isRequired,
    statusDate: PropTypes.string,
    profileStatusComment: PropTypes.string,
    statusAuthor: PropTypes.string,
    permission: PropTypes.shape({
      permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    fsaMigrationStatus: PropTypes.string,
    modals: PropTypes.shape({
      playerStatusModal: PropTypes.modalType,
    }).isRequired,
  };

  static defaultProps = {
    reason: null,
    status: null,
    statusDate: null,
    statusAuthor: null,
    profileStatusComment: '',
    fsaMigrationStatus: '',
  };

  state = {
    dropDownOpen: false,
  };

  toggle = () => {
    if (getActiveBrandConfig().fsaRegulation && this.props.fsaMigrationStatus === fsaStatuses.MIGRATION_FINISHED) {
      return;
    }

    this.setState(({ dropDownOpen }) => ({
      dropDownOpen: !dropDownOpen,
    }));
  };

  handleStatusClick = (action) => {
    const {
      availableStatuses,
      playerUUID,
      modals: {
        playerStatusModal,
      },
    } = this.props;

    if (availableStatuses.length) {
      playerStatusModal.show({
        reasons: action.reasons,
        action: action.action,
        playerUUID,
      });
    }
  };

  renderDropDown = (label, availableStatuses, dropDownOpen) => (
    <Dropdown isOpen={dropDownOpen} toggle={this.toggle}>
      <DropdownToggle tag="div">
        {label}
      </DropdownToggle>

      <DropdownMenu>
        {
          availableStatuses.map(({
            label: statusLabel, reasons, permission, ...rest
          }) => (
            <DropdownItem
              key={rest.action}
              {...rest}
              onClick={() => this.handleStatusClick({ statusLabel, reasons, ...rest })}
            >
              <span className="text-uppercase">{I18n.t(statusLabel)}</span>
            </DropdownItem>
          ))
        }
      </DropdownMenu>
    </Dropdown>
  );

  renderAuthor = (author) => {
    if (!author) {
      return null;
    }

    return (
      <div className="header-block-small">
        {I18n.t('COMMON.AUTHOR_BY')}
        {' '}
        <Uuid
          uuid={author}
          uuidPrefix={author.indexOf('OPERATOR') === -1 ? 'OP' : null}
        />
      </div>
    );
  };

  render() {
    const {
      availableStatuses,
      status,
      reason,
      statusDate,
      statusAuthor,
      profileStatusComment,
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const { dropDownOpen, modal } = this.state;
    const canChangeStatus = changeStatusPermissions.check(currentPermissions);
    const dropDownClassName = classNames('dropdown-highlight', {
      'cursor-pointer': availableStatuses.length > 0,
      'dropdown-open': dropDownOpen,
    });
    const label = (
      <div className="dropdown-tab header-block-inner">
        <div className="header-block-title">{I18n.t('COMMON.ACCOUNT_STATUS')}</div>
        {availableStatuses.length > 0 && canChangeStatus && <i className="fa fa-angle-down" />}
        <div className={classNames(statusColorNames[status], 'header-block-middle text-uppercase')}>
          {I18n.t(renderLabel(status, statusesLabels))}
        </div>
        {this.renderAuthor(statusAuthor)}
      </div>
    );

    if (availableStatuses.length === 0 || !canChangeStatus) {
      return label;
    }

    return (
      <div className={dropDownClassName}>
        {this.renderDropDown(label, availableStatuses, dropDownOpen, modal)}
        <If condition={status === statuses.BLOCKED}>
          <FailureReasonIcon
            reason={reason}
            statusDate={moment.utc(statusDate).local().format('YYYY-MM-DD HH:mm:ss')}
            statusAuthor={statusAuthor}
            profileStatusComment={profileStatusComment}
          />
        </If>
      </div>
    );
  }
}

export default compose(
  withPermission,
  withModals({
    playerStatusModal: PlayerStatusModal,
  }),
)(PlayerStatus);
