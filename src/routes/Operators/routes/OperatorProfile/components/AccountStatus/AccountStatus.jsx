import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import PermissionContent from 'components/PermissionContent';
import permissions from 'config/permissions';
import AccountStatusModal from './AccountStatusModal';
import { statuses } from '../../../../../../constants/user';

const initialState = {
  dropDownOpen: false,
  modal: {
    show: false,
    params: {},
  },
};

class AccountStatus extends Component {
  static propTypes = {
    label: PropTypes.any.isRequired,
    profileStatus: PropTypes.string,
    availableStatuses: PropTypes.array.isRequired,
    onStatusChange: PropTypes.func.isRequired,
  };

  static defaultProps ={
    profileStatus: '',
  };

  state = { ...initialState };

  toggle = () => {
    this.setState(({ dropDownOpen }) => ({
      dropDownOpen: !dropDownOpen,
    }));
  };

  handleStatusClick = (action) => {
    this.setState({
      modal: {
        show: true,
        params: {
          status: action.action,
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

  handleSubmit = (data) => {
    this.handleModalHide(null, () => this.props.onStatusChange(data));
  };

  renderDropDown = (label, availableStatuses, dropDownOpen) => (
    <Dropdown isOpen={dropDownOpen} toggle={this.toggle}>
      <DropdownToggle tag="div">
        {label}
        <PermissionContent permissions={permissions.OPERATORS.UPDATE_STATUS}>
          <i className="fa fa-angle-down" />
        </PermissionContent>
      </DropdownToggle>
      <PermissionContent permissions={permissions.OPERATORS.UPDATE_STATUS}>
        <DropdownMenu>
          {
            availableStatuses.map(({ label: statusLabel, reasons, ...rest }) => (
              <DropdownItem
                key={rest.action}
                {...rest}
                onClick={() => this.handleStatusClick({ statusLabel, reasons, ...rest })}
              >
                {statusLabel}
              </DropdownItem>
            ))
          }
        </DropdownMenu>
      </PermissionContent>
    </Dropdown>
  );

  render() {
    const { dropDownOpen, modal } = this.state;
    const { label, availableStatuses, profileStatus } = this.props;

    const dropdownClassName = classNames('dropdown-highlight', {
      'cursor-pointer': profileStatus !== statuses.SUSPENDED && availableStatuses.length > 0,
      'dropdown-open': dropDownOpen,
    });

    return (
      <div className={dropdownClassName}>
        {
          availableStatuses.length === 0
            ? label
            : this.renderDropDown(label, availableStatuses, dropDownOpen, modal)
        }

        {
          availableStatuses.length > 0 && modal.show
          && (
            <AccountStatusModal
              title="Change account status"
              {...modal.params}
              onSubmit={this.handleSubmit}
              onHide={this.handleModalHide}
            />
          )
        }
      </div>
    );
  }
}

export default AccountStatus;
