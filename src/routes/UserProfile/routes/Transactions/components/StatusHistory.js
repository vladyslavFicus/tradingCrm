import React, { Component, PropTypes } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import { statusesColor } from 'constants/transaction';
import classNames from 'classnames';
import moment from 'moment';

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
      dropDownOpen: !this.state.dropDownOpen
    }, () => {
      if (this.state.dropDownOpen) {
        this.props.onLoad()
          .then(action => {
            if (action && !action.error) {
              this.setState({
                statusHistory: action.payload,
              });
            }
          });
      }
    });
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

  renderDropDown = (label, statusHistory, dropDownOpen) => {
    return <Dropdown isOpen={dropDownOpen} toggle={this.toggle}>
      <span onClick={this.toggle}>{label}</span>
      <DropdownMenu>
        {
          statusHistory.map((status) => (
            <DropdownItem className='text-uppercase' key={status.reference}>
              <div className={classNames(statusesColor[status.paymentStatus], 'font-weight-700')}>
                {status.paymentStatus}
              </div>
              <span className="font-size-10 color-default">
                {moment(status.creationTime).format('DD.MM.YYYY \- HH:mm:ss')}
              </span>
            </DropdownItem>
          ))
        }
      </DropdownMenu>
    </Dropdown>
  }
}

export default StatusHistory;
