import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import { statusesColor } from '../../constants/transaction';

class StatusHistory extends Component {
  static propTypes = {
    label: PropTypes.any.isRequired,
    onLoad: PropTypes.func.isRequired,
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
        const action = await this.props.onLoad();

        if (action && !action.error) {
          this.setState({
            statusHistory: action.payload,
          });
        }
      }
    });
  };

  renderDropDown = (label, statusHistory, dropDownOpen) => {
    return (
      <Dropdown isOpen={dropDownOpen} toggle={this.toggle}>
        <span onClick={this.toggle}>{label}</span>
        <DropdownMenu>
          {
            statusHistory.map(status => (
              <DropdownItem className="text-uppercase" key={status.reference}>
                <div className={classNames(statusesColor[status.paymentStatus], 'font-weight-700')}>
                  {status.paymentStatus}
                </div>
                <div className="font-size-10 color-default">
                  {moment(status.creationTime).format('DD.MM.YYYY - HH:mm:ss')}
                </div>
                <div className="font-size-10 color-default">
                  {status.initiatorType}
                </div>
              </DropdownItem>
            ))
          }
        </DropdownMenu>
      </Dropdown>
    );
  };

  render() {
    const { dropDownOpen, statusHistory } = this.state;
    const { label } = this.props;

    return (
      !statusHistory
        ? label
        : this.renderDropDown(label, statusHistory, dropDownOpen)
    );
  }
}

export default StatusHistory;
