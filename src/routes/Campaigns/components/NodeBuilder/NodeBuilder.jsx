import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import { SelectField } from '../../../../components/ReduxForm';

class NodeBuilder extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        component: PropTypes.func.isRequired,
        items: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
    ).isRequired,
    fields: PropTypes.object.isRequired,
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeLabels: PropTypes.object.isRequired,
  };

  static defaultProps = {
    className: '',
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      components: props.options
        .reduce((acc, { type, component }) => ({ ...acc, [type]: component }), {}),
      nodes: props.options
        .reduce((acc, curr) => [
          ...acc,
          ...curr.items.map(uuid => ({ type: curr.type, uuid, id: uuid })),
        ], []),
    };
  }

  handleSelectNode = (e) => {
    this.setState({ selectedNode: e.target.value });
  };

  handleAddNode = () => {
    const { fields: { length: nodesLength } } = this.props;
    const { nodes, selectedNode } = this.state;

    this.setState({
      nodes: [
        ...nodes, {
          type: selectedNode,
          id: `${selectedNode}-${nodesLength - 1}-${moment.utc().unix()}`,
        },
      ],
    });
  };

  handleChangeUUID = (index, uuid) => {
    const { fields: { insert } } = this.props;

    insert(index, { uuid });
  };

  handleRemoveNode = (id, index) => {
    const { nodes } = this.state;

    this.props.fields.remove(index);
    this.setState({ nodes: nodes.filter(({ id: nodeId }) => id !== nodeId) });
  };

  render() {
    const { nodes, selectedNode, components } = this.state;
    const { types, fields, typeLabels, name, className } = this.props;

    return (
      <div className={classNames(className)}>
        <For each="node" index="index" of={nodes}>
          <div key={node.id} className="container-fluid add-campaign-container">
            <div className="row align-items-center">
              <div className="col text-truncate add-campaign-label">
                {I18n.t(typeLabels[node.type])}
              </div>
              <div className="col-auto text-right">
                <button
                  type="button"
                  onClick={() => this.handleRemoveNode(node.id, index)}
                  className="btn-transparent add-campaign-remove"
                >
                &times;
                </button>
              </div>
            </div>
            {React.createElement(components[node.type], {
              id: node.id,
              index,
              onChangeUUID: this.handleChangeUUID,
              name: `${name}[${index}]`,
              uuid: get(fields.get(index), 'uuid', ''),
            })}
          </div>
        </For>
        <div className="row no-gutters py-5 add-campaign-setting">
          <div className="col-5">
            <SelectField
              position="vertical"
              input={{
                value: selectedNode,
                onChange: this.handleSelectNode,
              }}
              component={SelectField}
            >
              <option value="">{I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.SELECT_REWARDS')}</option>
              {
                types.map(type => (
                  <option key={type} value={type}>
                    {I18n.t(typeLabels[type])}
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
              disabled={!selectedNode}
              onClick={this.handleAddNode}
            >
              {I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.ADD_REWARDS')}
            </button>
          </div>
        </div>
      </div>

    );
  }
}

export default NodeBuilder;
