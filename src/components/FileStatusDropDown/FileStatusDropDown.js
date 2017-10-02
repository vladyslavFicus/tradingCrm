import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import Uuid from '../../components/Uuid';
import { statuses, statusActions, statusesColorNames, statusesLabels, actionsColorNames } from '../../constants/files';

class FileStatusDropDown extends Component {
  static propTypes = {
    status: PropTypes.status.isRequired,
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
      <div>
        <div className={classNames('font-weight-700 status', statusesColorNames[status.value])}>
          {
            statusesLabels[status.value]
              ? statusesLabels[status.value]
              : status.value
          }
          <i className="fa fa-angle-down" />
        </div>
        {
          status.value !== statuses.PENDING &&
          <div className="font-size-11">
            {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={status.author} />
          </div>
        }
      </div>
    );

    if (!statusActions[status.value]) {
      return label;
    }

    return (
      <Dropdown isOpen={dropDownOpen} toggle={this.toggle} className="status-dropdown">
        <span onClick={this.toggle} className="cursor-pointer">
          {label}
        </span>
        <DropdownMenu>
          {
            statusActions[status.value].map(item => (
              <DropdownItem
                onClick={() => this.props.onStatusChange(item.action)}
                className={classNames('text-uppercase', actionsColorNames[item.action])}
                key={item.label}
              >
                <div className="font-weight-700">
                  {item.label}
                </div>
              </DropdownItem>
            ))
          }
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default FileStatusDropDown;
