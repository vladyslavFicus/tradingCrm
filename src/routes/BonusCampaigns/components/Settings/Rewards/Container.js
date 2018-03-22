import React, { Component } from 'react';
import { Field } from 'redux-form';
import { difference } from 'lodash';
import keyMirror from 'keymirror';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../constants/propTypes';
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
    freeSpinTemplates: PropTypes.array,
    baseCurrency: PropTypes.string.isRequired,
    fetchFreeSpinTemplate: PropTypes.func.isRequired,
    fetchGames: PropTypes.func.isRequired,
    fetchFreeSpinTemplates: PropTypes.func.isRequired,
    fetchBonusTemplates: PropTypes.func.isRequired,
    fetchBonusTemplate: PropTypes.func.isRequired,
    bonusTemplates: PropTypes.arrayOf(PropTypes.bonusTemplateListEntity),
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    freeSpinCustomTemplate: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    onToggleFreeSpinCustomTemplate: PropTypes.func.isRequired,
    bonusCustomTemplate: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    onToggleBonusCustomTemplate: PropTypes.func.isRequired,
    fetchGameAggregators: PropTypes.func.isRequired,
    aggregators: PropTypes.object.isRequired,
  };

  static defaultProps = {
    disabled: false,
    activeNodes: [],
    games: [],
    freeSpinTemplates: [],
    bonusTemplates: [],
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
      aggregators,
      change,
      freeSpinTemplates,
      baseCurrency,
      fetchFreeSpinTemplate,
      fetchGames,
      fetchFreeSpinTemplates,
      fetchBonusTemplates,
      fetchBonusTemplate,
      bonusTemplates,
      currencies,
      freeSpinCustomTemplate,
      onToggleFreeSpinCustomTemplate,
      bonusCustomTemplate,
      onToggleBonusCustomTemplate,
      fetchGameAggregators,
    } = this.props;

    const bonusNodePath = `${nodeGroupTypes.rewards}.${nodeTypes.bonus}`;
    const freeSpinNodePath = `${nodeGroupTypes.rewards}.${nodeTypes.freeSpin}`;

    switch (node) {
      case nodeTypes.bonus:
        return (
          <BonusNode
            currencies={currencies}
            disabled={disabled}
            typeValues={allowedCustomValueTypes}
            remove={() => this.handleRemoveNode(nodeTypes.bonus)}
            nodePath={bonusNodePath}
          />
        );
      case nodeTypes.freeSpin:
        return (
          <FreeSpinNode
            currencies={currencies}
            typeValues={allowedCustomValueTypes}
            remove={() => this.handleRemoveNode(nodeTypes.freeSpin)}
            nodePath={freeSpinNodePath}
            games={games}
            aggregators={aggregators}
            change={change}
            freeSpinTemplates={freeSpinTemplates}
            bonusTemplates={bonusTemplates}
            baseCurrency={baseCurrency}
            fetchFreeSpinTemplate={fetchFreeSpinTemplate}
            fetchGames={fetchGames}
            fetchFreeSpinTemplates={fetchFreeSpinTemplates}
            fetchBonusTemplates={fetchBonusTemplates}
            fetchBonusTemplate={fetchBonusTemplate}
            disabled={disabled}
            customTemplate={freeSpinCustomTemplate}
            onToggleFreeSpinCustomTemplate={onToggleFreeSpinCustomTemplate}
            bonusCustomTemplate={bonusCustomTemplate}
            onToggleBonusCustomTemplate={onToggleBonusCustomTemplate}
            fetchGameAggregators={fetchGameAggregators}
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
      <div className="col-6">
        {activeNodes.map(node =>
          <div key={node}>{this.renderNode(node)}</div>
        )}
        {
          (availableNodes.length > 0 && !activeNodes.length) &&
          <div className="row no-gutters py-5 add-campaign-setting">
            <div className="col-5">
              <Field
                name="r"
                id={`${form}RewardType`}
                position="vertical"
                disabled={disabled}
                input={{
                  value: selectedNode,
                  onChange: e => this.handleSelectNode(e.target.value),
                }}
                component={SelectField}
              >
                <option value="">{I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.SELECT_REWARDS')}</option>
                {
                  availableNodes.map(key => (
                    <option key={key} value={key}>
                      {renderLabel(key, nodeTypesLabels)}
                    </option>
                  ))
                }
              </Field>
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
