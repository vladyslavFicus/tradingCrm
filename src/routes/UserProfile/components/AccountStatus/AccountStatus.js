import React, { Component, PropTypes } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import AccountStatusModal from './AccountStatusModal';
import { suspendPeriods } from 'config/user';
import moment from 'moment';

class AccountStatus extends Component {
  state = {
    dropdownOpen: false,
    modal: {
      show: false,
      params: {},
    },
  };

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
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
    })
  };

  handleModalHide = (e, callback) => {
    this.setState({
      modal: {
        show: false,
        params: {},
      },
    }, function () {
      if (typeof callback === 'function') {
        callback();
      }
    })
  };

  handleSubmit = ({ period, ...data }) => {
    this.handleModalHide(null, () => {
      if (period) {
        if (period === suspendPeriods.DAY) {
          data.suspendEndDate = moment().add(1, 'days').format('YYYY-MM-DD\THH:mm:ss');
        } else if (period === suspendPeriods.WEEK) {
          data.suspendEndDate = moment().add(7, 'days').format('YYYY-MM-DD\THH:mm:ss');
        } else if (period === suspendPeriods.MONTH) {
          data.suspendEndDate = moment().add(1, 'months').format('YYYY-MM-DD\THH:mm:ss');
        }
      }

      return this.props.onStatusChange(data);
    });
  };

  render() {
    const { dropdownOpen, modal } = this.state;
    const { label, availableStatuses } = this.props;

    return (
      availableStatuses.length === 0
        ? label
        : this.renderDropDown(label, availableStatuses, dropdownOpen, modal)
    );
  }

  renderDropDown = (label, availableStatuses, dropdownOpen, modal) => {
    return (
      <div>
        <Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
          <span onClick={this.toggle}>{label}</span>

          <DropdownMenu>
            {
              availableStatuses.map(({ label, reasons, ...rest }) => (
                <DropdownItem
                  key={rest.action}
                  {...rest}
                  onClick={this.handleStatusClick.bind(this, { label, reasons, ...rest })}
                >
                  {label}
                </DropdownItem>
              ))
            }
          </DropdownMenu>
        </Dropdown>

        {modal.show && <AccountStatusModal
          title={'Change account status'}
          show={true}
          {...modal.params}
          onSubmit={this.handleSubmit}
          onHide={this.handleModalHide}
        />}
      </div>
    );
  }
}

AccountStatus.propTypes = {
  label: PropTypes.any.isRequired,
  availableStatuses: PropTypes.array.isRequired,
};

export default AccountStatus;
