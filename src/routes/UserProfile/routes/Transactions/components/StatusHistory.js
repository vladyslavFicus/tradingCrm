import React, { Component, PropTypes } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import { statusesColor } from 'constants/transaction';
import classNames from 'classnames';

class StatusHistory extends Component {
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
    return (
      <div>
        <Dropdown isOpen={dropDownOpen} toggle={this.toggle}>
          <span onClick={this.toggle}>{label}</span>
          <DropdownMenu>
            {
              statusHistory.map((status) => (
                <DropdownItem
                  className={classNames(statusesColor[status.transactionName], 'text-uppercase')}
                  key={status.transactionId}
                >
                  {status.transactionName}
                </DropdownItem>
              ))
            }
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

StatusHistory.propTypes = {
  label: PropTypes.any.isRequired,
  statusHistory: PropTypes.arrayOf(PropTypes.shape({
    transactionName: PropTypes.string,
    transactionId: PropTypes.string,
  })).isRequired,
  onLoad: PropTypes.func.isRequired,
};

StatusHistory.defaultProps = {
  statusHistory: []
};

export default StatusHistory;
