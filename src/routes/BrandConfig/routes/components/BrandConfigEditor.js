import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import parseJson from 'utils/parseJson';
import JsonEditor from './JsonEditor';

class BrandConfigEditor extends PureComponent {
  static propTypes = {
    value: PropTypes.shape({
      brandId: PropTypes.string,
      config: PropTypes.string,
    }),
  };

  static defaultProps = {
    value: {
      brandId: '',
      config: '{}',
    },
  };

  getValue = () => {
    const { brandId, config: rawConfig } = this.jsonEditor.getValue();
    const config = !rawConfig || typeof rawConfig !== 'object' ? {} : rawConfig;

    return {
      brandId,
      config: JSON.stringify(config),
    };
  };

  setValue = ({ brandId, config }) => {
    this.jsonEditor.setValue({
      brandId,
      config: typeof config === 'string' ? parseJson(config) : config,
    });
  };

  resetValue = () => {
    this.setValue(this.props.value);
  };

  render() {
    const { value: { brandId, config } } = this.props;

    return (
      <JsonEditor
        value={{
          brandId,
          config: parseJson(config),
        }}
        ref={(jsonEditor) => { this.jsonEditor = jsonEditor; }}
      />
    );
  }
}

export default BrandConfigEditor;
