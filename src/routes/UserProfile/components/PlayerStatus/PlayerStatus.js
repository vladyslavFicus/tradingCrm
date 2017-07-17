import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import moment from 'moment';
import PlayerStatusModal from './PlayerStatusModal';
import { statuses, suspendPeriods, statusColorNames } from '../../../../constants/user';

const initialState = {
  dropDownOpen: false,
  modal: {
    show: false,
    params: {},
  },
};

class PlayerStatus extends Component {
  static propTypes = {
    status: PropTypes.oneOf(Object.keys(statuses)),
    reason: PropTypes.string,
    endDate: PropTypes.string,
    availableStatuses: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
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

  handleSubmit = ({ period, ...data }) => {
    this.handleModalHide(null, () => {
      const statusData = { ...data };
      if (period) {
        if (period === suspendPeriods.DAY) {
          statusData.suspendEndDate = moment().add(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
        } else if (period === suspendPeriods.WEEK) {
          statusData.suspendEndDate = moment().add(7, 'days').format('YYYY-MM-DDTHH:mm:ss');
        } else if (period === suspendPeriods.MONTH) {
          statusData.suspendEndDate = moment().add(1, 'months').format('YYYY-MM-DDTHH:mm:ss');
        }
      }

      return this.props.onChange(statusData);
    });
  };

  renderDropDown = (label, availableStatuses, dropDownOpen) => (
    <Dropdown isOpen={dropDownOpen} toggle={this.toggle} onClick={this.toggle}>
      {label}

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
    </Dropdown>
  );

  render() {
    const { dropDownOpen, modal } = this.state;
    const { availableStatuses, status, reason, endDate } = this.props;
    const dropDownClassName = classNames('dropdown-highlight', {
      'cursor-pointer': status !== statuses.SUSPENDED && status !== statuses.INACTIVE,
      'no-dropdown': status !== statuses.ACTIVE,
      'dropdown-open': dropDownOpen,
    });
    const label = (
      <div className="dropdown-tab">
        <div className="header-block-title">Account Status</div>
        <div className={`header-block-middle ${statusColorNames[status]}`}>{status}</div>
        {
          !!reason &&
          <div className="header-block-small">
            by {reason}
          </div>
        }
        {
          !!endDate &&
          <div className="header-block-small">
            Until {moment(endDate).format('L')}
          </div>
        }
        {
          status === statuses.BLOCKED &&
          <span className="failure-reason-icon" />
        }
      </div>
    );

    if (availableStatuses.length === 0) {
      return label;
    }

    return (
      <div className={dropDownClassName}>
        {
          availableStatuses.length === 0
            ? label
            : this.renderDropDown(label, availableStatuses, dropDownOpen, modal)
        }

        {
          availableStatuses.length > 0 && modal.show &&
          <PlayerStatusModal
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

export default PlayerStatus;
