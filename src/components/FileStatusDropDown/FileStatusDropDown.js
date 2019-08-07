import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import Uuid from '../Uuid';
import {
  statuses,
  statusesLabels,
} from '../../constants/files';
import renderLabel from '../../utils/renderLabel';

class FileStatusDropDown extends Component {
  static propTypes = {
    status: PropTypes.object.isRequired,
    onStatusChange: PropTypes.func.isRequired,
    statusDocument: PropTypes.string.isRequired,
  };

  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  state = {
    dropDownOpen: false,
  };

  toggle = () => {
    this.setState(({ dropDownOpen }) => ({
      dropDownOpen: !dropDownOpen,
    }));
  };

  render() {
    const { dropDownOpen } = this.state;
    const { status, onStatusChange, statusDocument } = this.props;

    const label = (
      <div>
        <div className="font-weight-700 status">
          {renderLabel(statusDocument, statusesLabels)}
          <i className="fa fa-angle-down" />
        </div>
        <div className="font-size-11">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={status.author} />
        </div>
      </div>
    );

    if (statuses.length === 0) {
      return label;
    }

    return (
      <Dropdown isOpen={dropDownOpen} toggle={this.toggle} className="status-dropdown">
        <DropdownToggle
          tag="div"
          className="cursor-pointer"
        >
          {label}
        </DropdownToggle>
        <DropdownMenu>
          {Object.keys(statuses).map(value => (
            <DropdownItem
              onClick={() => onStatusChange(value)}
              className="text-uppercase font-weight-700"
              key={value}
            >
              {I18n.t(statusesLabels[value])}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default FileStatusDropDown;
