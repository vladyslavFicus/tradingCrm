import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import get from 'lodash/get';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { NasSelectField } from '../../../../../components/ReduxForm';
import Placeholder from '../../../../../components/Placeholder';

export default class FreeSpinView extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    freeSpinTemplates: PropTypes.shape({
      freeSpinTemplates: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
      })),
    }).isRequired,
    freeSpinTemplate: PropTypes.shape({
      freeSpinTemplate: PropTypes.shape({
        data: PropTypes.shape({
          uuid: PropTypes.string,
          status: PropTypes.string,
        }),
      }),
    }),
  };

  static defaultProps = {
    freeSpinTemplate: {},
  };

  render() {
    const { freeSpinTemplates: { freeSpinTemplates }, name, freeSpinTemplate: { freeSpinTemplate, loading } } = this.props;
    const fsTemplates = freeSpinTemplates || [];
    const fsTemplate = get(freeSpinTemplate, 'data', {});

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
        </div>
        <div className="row">
          <Placeholder
            ready={!loading}
            className={null}
            customPlaceholder={(
              <div className="panel-heading-row__info">
                <div className="panel-heading-row__info-title">
                  <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
                </div>
                <div className="panel-heading-row__info-ids">
                  <TextRow className="animated-background" style={{ width: '220px', height: '12px' }} />
                </div>
              </div>
            )}
          >
            <div className="free-spin-template__item">
              <div className="free-spin-template">status</div>
              <div>
                <div className="free-spin-template">{fsTemplate.status}</div>
              </div>
            </div>
          </Placeholder>
        </div>
      </div>
    );
  }
}
