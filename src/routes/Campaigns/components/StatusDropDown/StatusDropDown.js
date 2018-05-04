import React, { Component } from 'react';
import { compose } from 'redux';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../constants/propTypes';
import ChangeStatusModal from '../ChangeStatusModal';
import { statuses } from '../../../../constants/bonus-campaigns';
import BonusCampaignStatus from '../../../../components/BonusCampaignStatus';
import { withModals } from '../../../../components/HighOrder';

const initialState = {
  dropDownOpen: false,
};

class StatusDropDown extends Component {
  static propTypes = {
    campaign: PropTypes.bonusCampaignEntity.isRequired,
    availableStatusActions: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      changeStatusModal: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
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
    const { campaign, modals } = this.props;

    modals.changeStatusModal.show({
      campaign,
      onSubmit: this.handleSubmit,
      initialValues: {
        action: action.action,
        reasons: action.reasons,
      },
      ...action,
    });
  };

  handleSubmit = ({ reason, action }) => {
    const { onChange, campaign: { uuid }, modals } = this.props;

    modals.changeStatusModal.hide();

    onChange({
      id: uuid,
      reason,
      action,
    });
  };

  renderDropDown = (label, availableStatuses, dropDownOpen) => (
    <Dropdown isOpen={dropDownOpen} toggle={this.toggle} onClick={this.toggle}>
      <DropdownToggle
        tag="div"
        onClick={this.toggle}
        data-toggle="dropdown"
        aria-expanded={dropDownOpen}
        className="btn-transparent-text text-left cursor-pointer"
      >
        {label}
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
    const { dropDownOpen } = this.state;
    const { campaign, availableStatusActions } = this.props;
    const dropDownClassName = classNames('dropdown-highlight', {
      'cursor-pointer': status !== statuses.SUSPENDED && status !== statuses.INACTIVE,
      'no-dropdown': status !== statuses.ACTIVE,
      'dropdown-open': dropDownOpen,
    });
    const label = (
      <div className="dropdown-tab">
        <div className="header-block-title">
          {I18n.t('CAMPAIGNS.STATUS_DROPDOWN.TITLE')}
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
            : this.renderDropDown(label, availableStatusActions, dropDownOpen)
        }
      </div>
    );
  }
}

export default compose(
  withModals({ changeStatusModal: ChangeStatusModal }),
)(StatusDropDown);
