import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import _ from 'lodash';
import { SelectField } from '../../../../../../../../components/ReduxForm';
import {
  Deposit as DepositNode,
  ProfileCompleted as ProfileCompletedNode,
} from './Nodes';
import renderLabel from '../../../../../../../../utils/renderLabel';
import attributeLabels, { nodeTypes, nodeTypesLabels } from './constants';
import { nodeGroupTypes } from '../../constants';
import getSubFieldErrors from '../../../../../../../../utils/getSubFieldErrors';

const ALL_NODES = [nodeTypes.deposit, nodeTypes.profileCompleted];

class Container extends Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    errors: PropTypes.object,
    disabled: PropTypes.bool,
    activeNodes: PropTypes.array,
    add: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  };

  static defaultProps = {
    errors: {},
    disabled: false,
    activeNodes: [],
  };

  state = {
    selectedNode: null,
  };

  handleAddNode = () => this.props.add(this.state.selectedNode);

  handleRemoveNode = (node) => {
    this.props.remove(node);
    this.handleRefreshActiveNodes();
  }

  handleRefreshActiveNodes = () => {
    const { change, activeNodes } = this.props;

    change(nodeGroupTypes.fulfillments, {});

    const availableNodes = _.difference(ALL_NODES, activeNodes);
    if (availableNodes.length > 0) {
      this.handleSelectNode(availableNodes[0]);
    }
  }

  handleSelectNode = (value) => {
    this.setState({
      selectedNode: value,
    });
  }

  handleSelectPureNode = node => this.props.change(`${nodeGroupTypes.fulfillments}.${node}`, true);

  renderNode = (node) => {
    const {
      errors,
      disabled,
    } = this.props;

    const nodePath = `${nodeGroupTypes.fulfillments}.${nodeTypes.deposit}`;

    switch (node) {
      case nodeTypes.deposit:
        return (
          <DepositNode
            disabled={disabled}
            label={I18n.t(nodeTypesLabels[nodeTypes.deposit])}
            remove={() => this.handleRemoveNode(nodeTypes.deposit)}
            errors={getSubFieldErrors(errors, nodePath)}
            nodePath={nodePath}
          />
        );
      case nodeTypes.profileCompleted:
        return (
          <ProfileCompletedNode
            disabled={disabled}
            load={() => this.handleSelectPureNode(nodeTypes.profileCompleted)}
            remove={() => this.handleRemoveNode(nodeTypes.profileCompleted)}
            label={I18n.t(nodeTypesLabels[nodeTypes.profileCompleted])}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const { disabled, activeNodes } = this.props;
    const { selectedNode } = this.state;
    const availableNodes = _.difference(ALL_NODES, activeNodes);

    return (
      <div className="col-lg-6 padding-bottom-30 with-right-border">
        {activeNodes.map(node => this.renderNode(node))}
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
                <option value="">-- Select fulfillment --</option>
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
              {I18n.t(attributeLabels.addFulfillment)}
            </button>
          </div>
        }
      </div>
    );
  }
}

export default Container;
