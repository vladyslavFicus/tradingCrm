import React, { Component, PropTypes } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import AccountStatusModal from './AccountStatusModal';
import { suspendPeriods } from 'constants/user';
import moment from 'moment';
import classNames from 'classnames';
import { statuses } from 'constants/user';
import './AccountStatus.scss'

const initialState = {
  dropDownOpen: false,
  modal: {
    show: false,
    params: {},
  },
};

class AccountStatus extends Component {
  state = { ...initialState };

  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen
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

  handleSubmit = ({ period, ...data }) => {
    this.handleModalHide(null, () => {
      if (period) {
        if (period === suspendPeriods.DAY) {
          data.suspendEndDate = moment().add(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
        } else if (period === suspendPeriods.WEEK) {
          data.suspendEndDate = moment().add(7, 'days').format('YYYY-MM-DDTHH:mm:ss');
        } else if (period === suspendPeriods.MONTH) {
          data.suspendEndDate = moment().add(1, 'months').format('YYYY-MM-DDTHH:mm:ss');
        }
      }

      return this.props.onStatusChange(data);
    });
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
                {label}
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
    const dropdownClassName = classNames('player__account__status dropdown-highlight width-20 padding-0', {
      'cursor-pointer': profileStatus !== statuses.SUSPENDED,
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

AccountStatus.propTypes = {
  label: PropTypes.any.isRequired,
  profileStatus: PropTypes.string,
  availableStatuses: PropTypes.array.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

export default AccountStatus;
