import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
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
            status: action.action,
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

  handleSubmit = (data) => {
    this.handleModalHide(null, () => this.props.onStatusChange(data));
  };

  renderDropDown = (label, availableStatuses, dropDownOpen) => {
    return (
      <Dropdown isOpen={dropDownOpen} toggle={this.toggle} onClick={this.toggle}>
        {label}

        <DropdownMenu>
          {
            availableStatuses.map(({ label: statusLabel, reasons, ...rest }) => (
              <DropdownItem
                key={rest.action}
                {...rest}
                onClick={this.handleStatusClick.bind(this, { statusLabel, reasons, ...rest })}
              >
                {statusLabel}
              </DropdownItem>
            ))
          }
        </DropdownMenu>
      </Dropdown>
    );
  };

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
          availableStatuses.length > 0 && modal.show &&
          <AccountStatusModal
            title={'Change account status'}
            show
            {...modal.params}
            onSubmit={this.handleSubmit}
            onHide={this.handleModalHide}
          />
        }
      </div>
    );
  }
}

export default AccountStatus;
