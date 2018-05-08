import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../constants/propTypes';
import ChangeStatusModal from '../ChangeStatusModal';
import { statuses } from '../../../../constants/bonus-campaigns';
import BonusCampaignStatus from '../../../../components/BonusCampaignStatus';

const initialState = {
  dropDownOpen: false,
  modal: {
    show: false,
    params: {},
  },
};

class StatusDropDown extends Component {
  static propTypes = {
    campaign: PropTypes.bonusCampaignEntity.isRequired,
    availableStatusActions: PropTypes.array,
    onChange: PropTypes.func.isRequired,
  };
  static defaultProps = {
    availableStatusActions: [],
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

  handleSubmit = ({ reason, action }) => {
    const { onChange, campaign: { uuid } } = this.props;

    this.handleModalHide(null, () => onChange({
      id: uuid,
      reason,
      action,
    }));
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
        <i className="fa fa-angle-down" />
      </DropdownToggle>

      <DropdownMenu>
        {
          availableStatuses.map(({ label: statusLabel, className, reasons, ...rest }) => (
            <DropdownItem
              key={rest.action}
              className={classNames(className, 'font-weight-700 text-uppercase')}
              onClick={() => this.handleStatusClick({ statusLabel, reasons, ...rest })}
            >
              {I18n.t(statusLabel)}
            </DropdownItem>
          ))
        }
      </DropdownMenu>
    </Dropdown>
  );

  render() {
    const { dropDownOpen, modal } = this.state;
    const { campaign, availableStatusActions } = this.props;
    const dropDownClassName = classNames('dropdown-highlight', {
      'cursor-pointer': status !== statuses.SUSPENDED && status !== statuses.INACTIVE,
      'no-dropdown': status !== statuses.ACTIVE,
      'dropdown-open': dropDownOpen,
    });
    const label = (
      <div className="dropdown-tab">
        <div className="header-block-title">
          {I18n.t('BONUS_CAMPAIGNS.STATUS_DROPDOWN.TITLE')}
        </div>

        <BonusCampaignStatus campaign={campaign} />
      </div>
    );

    if (availableStatusActions.length === 0) {
      return label;
    }

    return (
      <div className={dropDownClassName}>
        {
          availableStatusActions.length === 0
            ? label
            : this.renderDropDown(label, availableStatusActions, dropDownOpen, modal)
        }

        {
          availableStatusActions.length > 0 && modal.show &&
          <ChangeStatusModal
            {...modal.params}
            campaign={campaign}
            onSubmit={this.handleSubmit}
            onHide={this.handleModalHide}
          />
        }
      </div>
    );
  }
}

export default StatusDropDown;
