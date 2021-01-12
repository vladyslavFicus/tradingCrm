import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import Select from 'components/Select';
import './MoveFileDropDown.scss';

class MoveFileDropDown extends PureComponent {
  static propTypes = {
    onMoveChange: PropTypes.func.isRequired,
    categories: PropTypes.object.isRequired,
    uuid: PropTypes.string.isRequired,
    verificationType: PropTypes.string.isRequired,
    documentType: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  state = {
    currentValue: JSON.stringify({
      verificationType: this.props.verificationType,
      documentType: this.props.documentType,
    }),
  };

  handleChange = (value) => {
    this.setState({ currentValue: value });
    this.props.onMoveChange(JSON.parse(value));
  };

  render() {
    const {
      categories,
      uuid,
      disabled,
    } = this.props;
    const { currentValue } = this.state;

    return (
      <Select
        customClassName="MoveFileDropDown"
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
        value={currentValue}
        onChange={this.handleChange}
        disabled={disabled}
      >
        {Object.entries(categories)
          .filter(([category]) => category !== 'OTHER')
          .map(([key, value]) => (value.map(item => (
            <option
              key={`${uuid}-${key}-${item}`}
              value={JSON.stringify({ verificationType: key, documentType: item })}
            >
              {`${I18n.t(`FILES.CATEGORIES.${key}`)} > ${I18n.t(`FILES.DOCUMENT_TYPES.${item}`)}`}
            </option>
          )))).flat()}
      </Select>
    );
  }
}

export default MoveFileDropDown;
