import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import classNames from 'classnames';
import { SelectField } from '../../../../components/ReduxForm';

class NodeBuilder extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    components: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeLabels: PropTypes.object.isRequired,
  };

  static defaultProps = {
    className: '',
    disabled: false,
  };

  state = {
    type: this.props.types[0],
  }

  handleSelectNode = (e) => {
    this.setState({ type: e.target.value });
  };

  handleAddNode = () => {
    this.props.fields.push({ type: this.state.type });
  };

  handleChangeUUID = (index, uuid) => {
    const { fields: { insert } } = this.props;

    insert(index, { uuid });
  };

  handleRemoveNode = (index) => {
    this.props.fields.remove(index);
  };

  render() {
    const { type } = this.state;
    const { types, fields, typeLabels, name, className, disabled, components } = this.props;

    return (
      <div className={classNames(className)}>
        <For each="field" index="index" of={fields.getAll()}>
          <div key={index} className="container-fluid add-campaign-container">
            <div className="row align-items-center">
              <div className="col text-truncate add-campaign-label">
                {I18n.t(typeLabels[field.type])}
              </div>
              <If condition={!disabled}>
                <div className="col-auto text-right">
                  <button
                    type="button"
                    onClick={() => this.handleRemoveNode(index)}
                    className="btn-transparent add-campaign-remove"
                  >
                &times;
                  </button>
                </div>
              </If>
            </div>
            {React.createElement(components[field.type], {
              index,
              disabled,
              onChangeUUID: this.handleChangeUUID,
              name: `${name}[${index}]`,
              uuid: field.uuid,
            })}
          </div>
        </For>
        <If condition={!disabled}>
          <div className="row no-gutters py-5 add-campaign-setting">
            <div className="col-5">
              <SelectField
                position="vertical"
                input={{
                  value: type,
                  onChange: this.handleSelectNode,
                }}
                component={SelectField}
              >
                <option value="">{I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.SELECT_REWARDS')}</option>
                {
                  types.map(option => (
                    <option key={option} value={option}>
                      {I18n.t(typeLabels[option])}
                    </option>
                  ))
                }
              </SelectField>
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="btn"
                id="add-rewards"
                disabled={!type}
                onClick={this.handleAddNode}
              >
                {I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.ADD_REWARDS')}
              </button>
            </div>
          </div>
        </If>
      </div>

    );
  }
}

export default NodeBuilder;
