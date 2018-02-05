import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { difference } from 'lodash';
import keyMirror from 'keymirror';
import { I18n } from 'react-redux-i18n';
import { nodeTypes, nodeTypesLabels } from './constants';
import { Bonus as BonusNode, FreeSpin as FreeSpinNode } from './Nodes';
import { SelectField } from '../../../../../components/ReduxForm';
import renderLabel from '../../../../../utils/renderLabel';

const nodeGroupTypes = keyMirror({
  fulfillments: null,
  rewards: null,
});

const ALL_NODES = [nodeTypes.bonus, nodeTypes.freeSpin];

class Container extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    activeNodes: PropTypes.array,
    change: PropTypes.func.isRequired,
    allowedCustomValueTypes: PropTypes.array.isRequired,
    add: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    games: PropTypes.array,
    providers: PropTypes.array,
    templates: PropTypes.array,
    currency: PropTypes.string.isRequired,
    fetchFreeSpinTemplate: PropTypes.func.isRequired,
    fetchGames: PropTypes.func.isRequired,
    fetchFreeSpinTemplates: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
    activeNodes: [],
    games: [],
    providers: [],
    templates: [],
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  };

  state = {
    selectedNode: null,
  };

  handleAddNode = () => this.props.add(this.state.selectedNode);

  handleRemoveNode = (node) => {
    this.props.remove(node);
    this.handleRefreshActiveNodes();
  };

  handleRefreshActiveNodes = () => {
    const { change, activeNodes } = this.props;
    const availableNodes = difference(ALL_NODES, activeNodes);

    change(nodeGroupTypes.rewards, {});
    if (availableNodes.length > 0) {
      this.handleSelectNode(availableNodes[0]);
    }
  };

  handleSelectNode = (value) => {
    this.setState({
      selectedNode: value,
    });
  };

  renderNode = (node) => {
    const {
      allowedCustomValueTypes,
      disabled,
      games,
      providers,
      change,
      templates,
      currency,
      fetchFreeSpinTemplate,
      fetchGames,
      fetchFreeSpinTemplates,
    } = this.props;

    const bonusNodePath = `${nodeGroupTypes.rewards}.${nodeTypes.bonus}`;
    const freeSpinNodePath = `${nodeGroupTypes.rewards}.${nodeTypes.freeSpin}`;

    switch (node) {
      case nodeTypes.bonus:
        return (
          <BonusNode
            disabled={disabled}
            typeValues={allowedCustomValueTypes}
            remove={() => this.handleRemoveNode(nodeTypes.bonus)}
            nodePath={bonusNodePath}
          />
        );
      case nodeTypes.freeSpin:
        return (
          <FreeSpinNode
            typeValues={allowedCustomValueTypes}
            remove={() => this.handleRemoveNode(nodeTypes.freeSpin)}
            nodePath={freeSpinNodePath}
            games={games}
            providers={providers}
            change={change}
            templates={templates}
            currency={currency}
            fetchFreeSpinTemplate={fetchFreeSpinTemplate}
            fetchGames={fetchGames}
            fetchFreeSpinTemplates={fetchFreeSpinTemplates}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { disabled, activeNodes } = this.props;
    const { selectedNode } = this.state;
    const { _reduxForm: { form } } = this.context;
    const availableNodes = difference(ALL_NODES, activeNodes);

    return (
      <div className="col-lg-6 padding-bottom-30">
        {activeNodes.map(node =>
          <div key={node}>{this.renderNode(node)}</div>
        )}
        {
          (availableNodes.length > 0 && !activeNodes.length) &&
          <div className="row no-gutters add-campaign-setting">
            <div className="col-5">
              <SelectField
                label=""
                id={`${form}RewardType`}
                position="vertical"
                labelClassName="no-label"
                disabled={disabled}
                input={{
                  value: selectedNode,
                  onChange: e => this.handleSelectNode(e.target.value),
                }}
              >
                <option value="">{I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.SELECT_REWARDS')}</option>
                {
                  availableNodes.map(key => (
                    <option key={key} value={key}>
                      {renderLabel(key, nodeTypesLabels)}
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
        }
      </div>
    );
  }
}

export default Container;
