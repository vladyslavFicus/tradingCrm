import React, { PureComponent } from 'react';
import { Field } from 'redux-form';
import { NasSelectField } from '../../../../../components/ReduxForm';

export default class FreeSpinView extends PureComponent {
  render() {
    const { uuid, freeSpinTemplates: { freeSpinTemplates }, name } = this.props;
    const fsTemplates = freeSpinTemplates || [];

    return (
      <div className="free-spin-template">
        <div className="row">
          <div className="col-8">
            <Field
              name={`${name}.uuid`}
              id={`${name}-uuid`}
              label={'tempalte'}
              component={NasSelectField}
              showErrorMessage={false}
              position="vertical"
            >
              {fsTemplates.map(item => (
                <option key={item.uuid} value={item.uuid}>
                  {item.name}
                </option>
              ))}
            </Field>
          </div>
          <div className="free-spin-template__item">
            <div className="free-spin-template">Available</div>
            <div>
              <div className="free-spin-template">10.04.2018 11:46:23</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
