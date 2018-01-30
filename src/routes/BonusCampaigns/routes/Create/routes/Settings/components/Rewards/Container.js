import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { I18n } from 'react-redux-i18n';
import { nodeTypes, nodeTypesLabels } from './constants';
import { Bonus as BonusNode, FreeSpin as FreeSpinNode } from './Nodes';
import { SelectField } from '../../../../../../../../components/ReduxForm';
import renderLabel from '../../../../../../../../utils/renderLabel';
import { nodeGroupTypes } from '../../constants';

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
    const availableNodes = _.difference(ALL_NODES, activeNodes);

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
    const availableNodes = _.difference(ALL_NODES, activeNodes);

    return (
      <div className="col-lg-6 padding-bottom-30">
        {activeNodes.map(node =>
          <div key={node}>{this.renderNode(node)}</div>
        )}
        {
          (availableNodes.length > 0 && !activeNodes.length) &&
          <div className="add-campaign-setting col-md-12">
            <div className="col-md-6">
              <SelectField
                label=""
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
            <button
              type="button"
              className="btn"
              disabled={!selectedNode}
              onClick={this.handleAddNode}
            >
              {I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.ADD_REWARDS')}
            </button>
          </div>
        }
      </div>
    );
  }
}

export default Container;
