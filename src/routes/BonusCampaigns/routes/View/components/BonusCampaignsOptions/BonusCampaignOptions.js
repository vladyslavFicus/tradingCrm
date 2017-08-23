import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';

const BonusCampaignOption = PropTypes.shape({
  label: PropTypes.string,
  onClick: PropTypes.func,
});

class BonusCampaignOptions extends Component {
  static propTypes = {
    label: PropTypes.any,
    items: PropTypes.arrayOf(BonusCampaignOption),
  };

  static defaultProps = {
    label: <i className="fa fa-caret-down" />,
    items: [],
  };

  state = {
    isOpened: false,
  };

  handleToggleDropDownState = () => {
    this.setState({ isOpened: !this.state.isOpened });
  };

  render() {
    const { isOpened } = this.state;
    const { label, items } = this.props;
    const visibleItems = items.filter(item => item.visible === undefined || item.visible);

    return (
      <Dropdown isOpen={isOpened} toggle={this.handleToggleDropDownState}>
        <button className="btn btn-sm btn-default-outline margin-left-10" onClick={this.handleToggleDropDownState}>
          {label}
        </button>

        <DropdownMenu right>
          {visibleItems.map(item => (
            <DropdownItem
              key={item.label}
              onClick={() => item.onClick(item)}
            >{item.label}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default BonusCampaignOptions;
