import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import Uuid from '../../components/Uuid';
import { statuses, statusActions, statusesColorNames, statusesLabels, actionsColorNames } from '../../constants/files';
import './FileStatusDropDown.scss';

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
        <div className={classNames('font-weight-700 file-status', statusesColorNames[status.value])}>
          {
            statusesLabels[status.value]
              ? statusesLabels[status.value]
              : status.value
          }
          <i className="fa fa-angle-down" />
        </div>
        {
          status.value !== statuses.UNDER_REVIEW &&
          <div className="font-size-10 color-default">
            {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={status.author} />
          </div>
        }
      </div>
    );

    if (!statusActions[status.value]) {
      return label;
    }

    return (
      <div className="file-status-dropdown">
        <Dropdown isOpen={dropDownOpen} toggle={this.toggle}>
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
      </div>
    );
  }
}

export default FileStatusDropDown;
