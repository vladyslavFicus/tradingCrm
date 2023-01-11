import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import Select from 'components/Select';
import './ChangeFileStatusDropDown.scss';

class ChangeFileStatusDropDown extends PureComponent {
  static propTypes = {
    onChangeStatus: PropTypes.func.isRequired,
    statusesFile: PropTypes.array.isRequired,
    uuid: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  state = {
    currentValue: '',
  };

  handleChange = (value) => {
    const {
      uuid,
      onChangeStatus,
    } = this.props;

    onChangeStatus(value, uuid);

    this.setState({ currentValue: value });
  };

  render() {
    const {
      status,
      statusesFile,
      uuid,
      disabled,
    } = this.props;
    const { currentValue } = this.state;

    return (
      <Select
        customClassName="ChangeFileStatusDropDown"
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
        value={currentValue || status}
        onChange={this.handleChange}
        disabled={disabled}
        hasTargetPortal
      >
        {statusesFile.map(({ value, label }) => (
          <option key={`${uuid}-${value}`} value={value}>{I18n.t(label)}</option>
        ))}
      </Select>
    );
  }
}

export default ChangeFileStatusDropDown;
