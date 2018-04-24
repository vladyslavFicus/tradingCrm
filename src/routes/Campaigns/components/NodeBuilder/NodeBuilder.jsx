import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import { SelectField } from '../../../../components/ReduxForm';

class NodeBuilder extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    nodeSelectLabel: PropTypes.string.isRequired,
    nodeButtonLabel: PropTypes.string.isRequired,
    components: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    typeLabels: PropTypes.object.isRequired,
  };
  static defaultProps = {
    className: '',
    disabled: false,
  };

  state = {
    type: '',
  };

  handleSelectNode = (e) => {
    this.setState({ type: e.target.value });
  };

  handleAddNode = () => {
    this.props.fields.push({ type: this.state.type });
  };

  handleChangeUUID = (index, uuid, type) => {
    const { fields: { insert, remove } } = this.props;

    remove(index);
    insert(index, { uuid, type });
  };

  handleRemoveNode = (index) => {
    this.props.fields.remove(index);
  };

  render() {
    const { type } = this.state;
    const {
      fields,
      nodeSelectLabel,
      nodeButtonLabel,
      typeLabels,
      name,
      className,
      disabled,
      components,
    } = this.props;
    const types = Object.keys(components);

    return (
      <div className={classNames(className)}>
        <For each="field" index="index" of={fields.getAll()}>
          <div key={index} className="container-fluid campaign-node">
            <div className="row align-items-center">
              <div className="col text-truncate campaign-node-label">
                {I18n.t(typeLabels[field.type])}
              </div>
              <If condition={!disabled}>
                <div className="col-auto">
                  <button
                    type="button"
                    onClick={() => this.handleRemoveNode(index)}
                    className="btn-transparent campaign-node-remove"
                  >
                    &times;
                  </button>
                </div>
              </If>
            </div>
            {React.createElement(components[field.type], {
              disabled,
              onChangeUUID: uuid => this.handleChangeUUID(index, uuid, field.type),
              name: `${name}[${index}]`,
              type: field.type,
              uuid: field.uuid,
            })}
          </div>
        </For>
        <If condition={!disabled && types.length}>
          <div className="form-row py-5 justify-content-center">
            <div className="col-5">
              <SelectField
                position="vertical"
                input={{
                  value: type,
                  onChange: this.handleSelectNode,
                }}
                component={SelectField}
                id={`qa-new-campaign-${name}-select`}
              >
                <option value="">{I18n.t(nodeSelectLabel)}</option>
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
                className="btn btn-default-outline"
                id={`qa-new-campaign-${name}-add-btn`}
                disabled={!type}
                onClick={this.handleAddNode}
              >
                {I18n.t(nodeButtonLabel)}
              </button>
            </div>
          </div>
        </If>
      </div>

    );
  }
}

export default NodeBuilder;
