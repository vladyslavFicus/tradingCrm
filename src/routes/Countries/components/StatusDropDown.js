import React, { Component, PropTypes } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { accessTypesActions, accessTypesColor, accessTypeLabels } from '../../../constants/countries';
import renderLabel from '../../../utils/renderLabel';

class StatusDropDown extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    onStatusChange: PropTypes.func.isRequired,
  };

  state = {
    dropDownOpen: false,
  };

  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    });
  };

  render() {
    const { dropDownOpen } = this.state;
    const { status } = this.props;

    const label = (
      <div className={classNames('font-weight-700', accessTypesColor[status])}>
        { renderLabel(status, accessTypeLabels) }
      </div>
    );

    return (
      <Dropdown isOpen={dropDownOpen} toggle={this.toggle}>
        <span onClick={this.toggle} className="cursor-pointer">
          {label}
        </span>
        <DropdownMenu>
          {
            accessTypesActions[status].map(item => (
              <DropdownItem
                onClick={() => this.props.onStatusChange(item.action)}
                className="text-uppercase"
                key={item.label}
              >
                <div className={'font-weight-700'}>
                  {I18n.t(item.label)}
                </div>
              </DropdownItem>
            ))
          }
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default StatusDropDown;
