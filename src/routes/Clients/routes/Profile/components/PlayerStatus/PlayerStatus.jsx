import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import FailureReasonIcon from '../../../../../../components/FailureReasonIcon';
import PlayerStatusModal from './PlayerStatusModal';
import { statuses, statusColorNames, statusesLabels, durationUnits } from '../../../../../../constants/user';
import Uuid from '../../../../../../components/Uuid';
import renderLabel from '../../../../../../utils/renderLabel';
import Permissions, { CONDITIONS } from '../../../../../../utils/permissions';
import permissions from '../../../../../../config/permissions';

const initialState = {
  dropDownOpen: false,
  modal: {
    show: false,
    params: {},
  },
};
const changeStatusPermissions = new Permissions([
  permissions.USER_PROFILE.PROLONG,
  permissions.USER_PROFILE.BLOCK,
  permissions.USER_PROFILE.UNBLOCK,
  permissions.USER_PROFILE.SUSPEND,
], CONDITIONS.OR);

class PlayerStatus extends Component {
  static propTypes = {
    status: PropTypes.oneOf(Object.keys(statuses)),
    reason: PropTypes.string,
    endDate: PropTypes.string,
    availableStatuses: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    statusDate: PropTypes.string,
    profileStatusComment: PropTypes.string,
    statusAuthor: PropTypes.string,
  };
  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };
  static defaultProps = {
    reason: null,
    endDate: null,
    status: null,
    statusDate: null,
    statusAuthor: null,
    profileStatusComment: '',
  };

  state = { ...initialState };

  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    });
  };

  handleStatusClick = (action) => {
    this.setState({
      modal: {
        show: true,
        params: {
          initialValues: {
            action: action.action,
            reasons: action.reasons,
          },
          ...action,
        },
      },
    });
  };

  handleModalHide = (e, callback) => {
    this.setState({
      modal: { ...initialState.modal },
    }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  handleSubmit = ({ period, reasons, ...data }) => {
    this.handleModalHide(null, () => {
      let statusData = { ...data };

      if (period === durationUnits.PERMANENT) {
        statusData.permanent = true;
      } else if (period) {
        const [durationAmount, durationUnit] = period.split(' ');
        statusData = { ...statusData, durationAmount, durationUnit };
      }

      return this.props.onChange(statusData);
    });
  };

  renderDropDown = (label, availableStatuses, dropDownOpen) => (
    <Dropdown isOpen={dropDownOpen} toggle={this.toggle} onClick={this.toggle}>
      <DropdownToggle
        tag="div"
        onClick={this.toggle}
        data-toggle="dropdown"
        aria-expanded={dropDownOpen}
      >
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
      endDate,
      locale,
      profileStatusComment,
    } = this.props;

    const { dropDownOpen, modal } = this.state;
    const canChangeStatus = changeStatusPermissions.check(this.context.permissions);
    const dropDownClassName = classNames('dropdown-highlight', {
      'cursor-pointer': availableStatuses.length > 0,
      'dropdown-open': dropDownOpen,
    });
    const label = (
      <div className="dropdown-tab">
        <div className="header-block-title">Account Status</div>
        {availableStatuses.length > 0 && canChangeStatus && <i className="fa fa-angle-down" />}
        <div className={classNames(statusColorNames[status], 'header-block-middle text-uppercase')}>
          {renderLabel(status, statusesLabels)}
        </div>
        {this.renderAuthor(statusAuthor)}
        {
          !!endDate &&
          <div className="header-block-small">
            {I18n.t('COMMON.DATE_UNTIL', { date: moment.utc(endDate).local().format('DD.MM.YYYY') })}
          </div>
        }
      </div>
    );

    if (availableStatuses.length === 0 || !canChangeStatus) {
      return label;
    }

    return (
      <div className={dropDownClassName}>
        {this.renderDropDown(label, availableStatuses, dropDownOpen, modal)}
        <If condition={status === statuses.BLOCKED || status === statuses.SUSPENDED}>
          <FailureReasonIcon
            reason={reason}
            statusDate={moment.utc(statusDate).local().format('YYYY-MM-DD HH:mm:ss')}
            statusAuthor={statusAuthor}
            profileStatusComment={profileStatusComment}
          />
        </If>
        {
          availableStatuses.length > 0 && modal.show &&
          <PlayerStatusModal
            locale={locale}
            title="Change account status"
            {...modal.params}
            onSubmit={this.handleSubmit}
            onHide={this.handleModalHide}
          />
        }
      </div>
    );
  }
}

export default PlayerStatus;
