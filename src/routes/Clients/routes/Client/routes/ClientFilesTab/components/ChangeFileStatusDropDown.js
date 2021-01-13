import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import Select from 'components/Select';

class ChangeFileStatusDropDown extends Component {
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

  render() {
    const {
      status,
      statusesFile,
      onChangeStatus,
      uuid,
      disabled,
    } = this.props;
    const { currentValue } = this.state;

    return (
      <Select
        disabled={disabled}
        value={currentValue || status}
        customClassName="filter-row__medium"
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
        onChange={(value) => {
          this.setState({ currentValue: value });
          onChangeStatus(value, uuid);
        }}
      >
        {statusesFile.map(({ value, label }) => (
          <option key={`${uuid}-${value}`} value={value}>{I18n.t(label)}</option>
        ))}
      </Select>
    );
  }
}

export default ChangeFileStatusDropDown;
