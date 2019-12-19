import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import Select from 'components/Select';

class MoveFileDropDown extends Component {
  static propTypes = {
    onMoveChange: PropTypes.func.isRequired,
    categories: PropTypes.object.isRequired,
    uuid: PropTypes.string.isRequired,
  };

  state = {
    currentValue: '',
  };

  render() {
    const { categories, onMoveChange, uuid } = this.props;
    const { currentValue } = this.state;

    return (
      <Select
        value={currentValue}
        customClassName="files-grid__status-dropdown"
        onChange={(value) => {
          this.setState({ currentValue: value });
          onMoveChange(JSON.parse(value));
        }}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
      >
        {Object.entries(categories)
          .map(([key, value]) => (value.map(item => (
            <option
              key={`${uuid}-${key}-${item}`}
              value={JSON.stringify({ verificationType: key, documentType: item, uuid })}
            >
              {`${I18n.t(`FILES.CATEGORIES.${key}`)} > ${I18n.t(`FILES.DOCUMENT_TYPES.${item}`)}`}
            </option>
          )))).flat()}
      </Select>
    );
  }
}

export default MoveFileDropDown;
