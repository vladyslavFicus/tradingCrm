import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import moment from 'moment';
import PlayerStatusModal from './PlayerStatusModal';
import { statuses, statusColorNames, statusesLabels, durationUnits } from '../../../../constants/user';

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
    locale: PropTypes.string.isRequired,
  };

  static defaultProps = {
    reason: null,
    endDate: null,
    status: null,
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
      {label}

      <DropdownMenu>
        {
          availableStatuses.map(({ label: statusLabel, reasons, permission, ...rest }) => (
            <DropdownItem
              key={rest.action}
              {...rest}
              onClick={() => this.handleStatusClick({ statusLabel, reasons, ...rest })}
            >
              <span className="text-uppercase">{statusLabel}</span>
            </DropdownItem>
          ))
        }
      </DropdownMenu>
    </Dropdown>
  );

  render() {
    const {
      availableStatuses,
      status,
      reason,
      endDate,
      locale,
    } = this.props;
    const { dropDownOpen, modal } = this.state;
    const dropDownClassName = classNames('dropdown-highlight', {
      'cursor-pointer': status !== statuses.SUSPENDED && status !== statuses.INACTIVE,
      'no-dropdown': status !== statuses.ACTIVE,
      'dropdown-open': dropDownOpen,
    });
    const label = (
      <div className="dropdown-tab">
        <div className="header-block-title">Account Status</div>
        {availableStatuses.length > 0 && <i className="fa fa-angle-down" />}
        <div className={classNames(statusColorNames[status], 'header-block-middle text-uppercase')}>
          {statusesLabels[status]}
        </div>
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
          <span className="failure-reason-icon failure-reason-icon_account-status" />
        }
      </div>
    );

    if (availableStatuses.length === 0) {
      return label;
    }

    return (
      <div className={dropDownClassName}>
        {this.renderDropDown(label, availableStatuses, dropDownOpen, modal)}

        {
          availableStatuses.length > 0 && modal.show &&
          <PlayerStatusModal
            locale={locale}
            title={'Change account status'}
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
