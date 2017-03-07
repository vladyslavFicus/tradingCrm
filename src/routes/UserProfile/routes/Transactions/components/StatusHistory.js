import React, { Component, PropTypes } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import { statusesColor } from 'constants/transaction';
import classNames from 'classnames';
import moment from 'moment';

class StatusHistory extends Component {
  static propTypes = {
    label: PropTypes.any.isRequired,
    statusHistory: PropTypes.arrayOf(PropTypes.shape({
      transactionName: PropTypes.string,
      transactionId: PropTypes.string,
    })).isRequired,
    onLoad: PropTypes.func.isRequired,
  };

  static defaultProps = {
    statusHistory: [],
  };

  state = {
    dropDownOpen: false,
  };

  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen
    }, () => {
      if (this.state.dropDownOpen) {
        this.props.onLoad();
      }
    });
  };

  render() {
    const { dropDownOpen } = this.state;
    const { label, statusHistory } = this.props;

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
            <DropdownItem className='text-uppercase' key={status.transactionId}>
              <div className={classNames(statusesColor[status.transactionName], 'font-weight-700')}>
                {status.transactionName}
              </div>
              <span className="font-size-10 color-default">
                {moment(status.transactionTime).format('DD.MM.YYYY \- HH:mm')}
              </span>
            </DropdownItem>
          ))
        }
      </DropdownMenu>
    </Dropdown>
  }
}

export default StatusHistory;
