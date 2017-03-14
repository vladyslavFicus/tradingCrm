import React, { Component, PropTypes } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import classNames from 'classnames';

const statusList = [
  'ACTIVE', 'INACTIVE'
];

class StatusDropDown extends Component {
  state = {
    dropDownOpen: false,
  };

  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen
    });
  };

  handleStatusClick = (action) => {
    const { onStatusChange } = this.props;
    onStatusChange(action.status);
  };

  render() {
    const { dropDownOpen } = this.state;
    const { label } = this.props;

    return <Dropdown isOpen={dropDownOpen} toggle={this.toggle}>
      <span onClick={this.toggle}>{label}</span>
      <DropdownMenu>
        {
          statusList.map(status => (
            <DropdownItem
              onClick={this.handleStatusClick.bind(this, { status })}
              className='text-uppercase'
              key={status}
            >
              <div className={classNames('color-success', 'font-weight-700')}>
                {status}
              </div>
            </DropdownItem>
          ))
        }
      </DropdownMenu>
    </Dropdown>
  }
}

export default StatusDropDown;
