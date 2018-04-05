import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { SelectField } from '../../../../components/ReduxForm';

class NodeBuilder extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(
          PropTypes.shape({
            uuid: PropTypes.string.isRequired,
          }).isRequired,
        ).isRequired,
      }).isRequired,
    ).isRequired,
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeLabels: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      nodes: props.options
        .reduce((acc, curr) => [
          ...acc,
          ...curr.items.map(({ uuid }) => ({ type: curr.type, uuid, id: uuid })),
        ], []),
    };
  }

  handleSelectNode = (e) => {
    this.setState({ selectedNode: e.target.value });
  };

  handleAddNode = () => {
    const { nodes, selectedNode } = this.state;

    this.setState({ nodes: [...nodes, { type: selectedNode, id: `${selectedNode}-${moment.utc().unix()}` }] });
  };

  handleRemoveNode = (id) => {
    const { nodes } = this.state;

    this.setState({ nodes: nodes.filter(({ id: nodeId }) => id !== nodeId) });
  };

  render() {
    const { nodes, selectedNode } = this.state;
    const { types, typeLabels } = this.props;

    return (
      <div className="col-6">
        <For each="node" of={nodes}>
          <div key={node.id} className="container-fluid add-campaign-container">
            <div className="row align-items-center">
              <div className="col text-truncate add-campaign-label">
                {I18n.t(typeLabels[node.type])}
              </div>
              <div className="col-auto text-right">
                <button
                  type="button"
                  onClick={() => this.handleRemoveNode(node.id)}
                  className="btn-transparent add-campaign-remove"
                >
                &times;
                </button>
              </div>

            </div>
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
