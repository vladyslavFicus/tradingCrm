import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { attributeLabels, deviceTypes, deviceTypesLabels } from '../constants';
import { SelectField } from '../../../../../components/ReduxForm';
import renderLabel from '../../../../../utils/renderLabel';

class DeviceTypeField extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    id: PropTypes.string,
  };
  static defaultProps = {
    id: null,
  };

  render() {
    const { name, disabled, id } = this.props;

    return (
      <Field
        name={name}
        label={I18n.t(attributeLabels.deviceType)}
        component={SelectField}
        showErrorMessage={false}
        className="col-md-6"
        disabled={disabled}
        id={id}
      >
        <option value="">{I18n.t(attributeLabels.chooseDeviceType)}</option>
        {Object.keys(deviceTypes).map(key => (
          <option key={key} value={key}>
            {renderLabel(key, deviceTypesLabels)}
          </option>
        ))}
      </Field>
    );
  }
}

export default DeviceTypeField;
