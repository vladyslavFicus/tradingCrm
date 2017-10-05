import React, { Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { Dropdown, DropdownMenu } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import _ from 'lodash';
import PropTypes from '../../constants/propTypes';
import { statusesColor, statusesLabels, statuses, initiators } from '../../constants/payment';
import Uuid from '../Uuid';
import FailedStatusIcon from '../FailedStatusIcon';
import renderLabel from '../../utils/renderLabel';

class TransactionStatus extends Component {
  static propTypes = {
    transaction: PropTypes.paymentEntity.isRequired,
    onLoadStatusHistory: PropTypes.func,
  };
  static defaultProps = {
    onLoadStatusHistory: null,
  };

  state = {
    dropDownOpen: false,
    statusHistory: [],
  };

  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    }, async () => {
      if (this.state.dropDownOpen) {
        const action = await this.props.onLoadStatusHistory();

        if (action && !action.error) {
          this.setState({
            statusHistory: action.payload,
          });
        }
      }
    });
  };

  renderDropDown = (label, statusHistory, dropDownOpen) => (
    <Dropdown isOpen={dropDownOpen} toggle={this.toggle} className="status-dropdown">
      <button className="btn-transparent-text text-left" onClick={this.toggle}>{label}</button>
      <DropdownMenu>
        {
          statusHistory.map(status => (
            <div className="dropdown-item text-uppercase" key={status.reference}>
              <div className={classNames(statusesColor[status.paymentStatus], 'font-weight-700')}>
                {status.paymentStatus}
              </div>
              <div className="font-size-11">
                {moment.utc(status.creationTime).local().format('DD.MM.YYYY - HH:mm:ss')}
              </div>
              <div className="font-size-11">
                {status.initiatorType}
                {
                  (status.initiatorType === initiators.PLAYER || status.initiatorType === initiators.OPERATOR) &&
                    <span>
                      {' '}
                      <Uuid uuid={status.initiatorId} />
                    </span>
                }
              </div>
            </div>
          ))
        }
      </DropdownMenu>
    </Dropdown>
  );

  render() {
    const { dropDownOpen, statusHistory } = this.state;
    const { transaction, onLoadStatusHistory } = this.props;
    const status = transaction.paymentFlowStatuses
      .find(flowStatus => flowStatus.paymentStatus.toUpperCase() === transaction.status);
    let authorUUID = null;
    const isApproved = transaction.paymentFlowStatuses
      .find(flowStatus => flowStatus.paymentStatus === _.startCase(statuses.APPROVED.toLowerCase()));
    let transactionStatus = transaction.status;

    if (status) {
      if (status.initialorType === initiators.OPERATOR) {
        authorUUID = { uuid: status.initiatorId };
      } else if (status.initiatorType === initiators.PLAYER) {
        authorUUID = {
          uuid: status.initiatorId,
          uuidPrefix: status.initiatorId.indexOf('PLAYER') === -1 ? 'PL' : null,
        };
      }
    }

    if (transaction.status === statuses.PENDING && isApproved) {
      transactionStatus = statuses.APPROVED;
    }

    const label = (
      <div>
        <div className={classNames(statusesColor[transactionStatus], 'font-weight-700 text-uppercase status')}>
          {renderLabel(transactionStatus, statusesLabels)}
          {
            transactionStatus === statuses.FAILED && !!transaction.reason &&
            <FailedStatusIcon id={`transaction-failure-reason-${transaction.paymentId}`}>
              {transaction.reason}
            </FailedStatusIcon>
          }
          <i className="fa fa-angle-down" />
        </div>
        {
          authorUUID &&
          <div className="font-size-11">
            {I18n.t('COMMON.AUTHOR_BY')}
            {' '}
            <Uuid {...authorUUID} />
          </div>
        }
        <div className="font-size-11">
          {I18n.t('COMMON.DATE_ON', {
            date: moment.utc(transaction.creationTime).local().format('DD.MM.YYYY - HH:mm:ss'),
          })}
        </div>
      </div>
    );

    return (
      !onLoadStatusHistory
        ? label
        : this.renderDropDown(label, statusHistory, dropDownOpen)
    );
  }
}

export default TransactionStatus;
