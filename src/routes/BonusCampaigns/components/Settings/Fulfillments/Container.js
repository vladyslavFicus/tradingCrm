import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { difference } from 'lodash';
import { SelectField } from '../../../../../components/ReduxForm';
import {
  Deposit as DepositNode,
  ProfileCompleted as ProfileCompletedNode,
  NoFulfillments as NoFulfillmentsNode,
} from './Nodes';
import renderLabel from '../../../../../utils/renderLabel';
import attributeLabels, { nodeTypes, nodeTypesLabels } from './constants';
import { nodeGroupTypes } from '../constants';

const ALL_NODES = [nodeTypes.deposit, nodeTypes.profileCompleted, nodeTypes.noFulfillments];

class Container extends Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    activeNodes: PropTypes.array,
    add: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    fetchPaymentMethods: PropTypes.func.isRequired,
    paymentMethods: PropTypes.array,
  };

  static defaultProps = {
    disabled: false,
    activeNodes: [],
    paymentMethods: [],
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

    change(nodeGroupTypes.fulfillments, {});

    const availableNodes = difference(ALL_NODES, activeNodes);
    if (availableNodes.length > 0) {
      this.handleSelectNode(availableNodes[0]);
    }
  };

  handleSelectNode = (value) => {
    this.setState({
      selectedNode: value,
    });
  };

  handleSelectPureNode = node => this.props.change(`${nodeGroupTypes.fulfillments}.${node}`, true);

  renderNode = (node) => {
    const { disabled, locale, fetchPaymentMethods, paymentMethods } = this.props;

    const nodePath = `${nodeGroupTypes.fulfillments}.${nodeTypes.deposit}`;

    switch (node) {
      case nodeTypes.deposit:
        return (
          <DepositNode
            fetchPaymentMethods={fetchPaymentMethods}
            paymentMethods={paymentMethods}
            locale={locale}
            disabled={disabled}
            label={I18n.t(nodeTypesLabels[nodeTypes.deposit])}
            remove={() => this.handleRemoveNode(nodeTypes.deposit)}
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
            nodePath={nodePath}
          />
        );
      case nodeTypes.noFulfillments:
        return (
          <NoFulfillmentsNode
            disabled={disabled}
            load={() => this.handleSelectPureNode(nodeTypes.noFulfillments)}
            remove={() => this.handleRemoveNode(nodeTypes.noFulfillments)}
            label={I18n.t(nodeTypesLabels[nodeTypes.noFulfillments])}
            nodePath={nodePath}
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
      <div className="col-lg-6 padding-bottom-30 with-right-border">
        {activeNodes.map(node =>
          <div key={node}>{this.renderNode(node)}</div>
        )}
        {
          (availableNodes.length > 0 && !activeNodes.length) &&
          <div className="add-campaign-setting col-md-12">
            <div className="col-md-6">
              <SelectField
                label=""
                id={`${form}FullfilmentType`}
                position="vertical"
                labelClassName="no-label"
                disabled={disabled}
                input={{
                  value: selectedNode,
                  onChange: e => this.handleSelectNode(e.target.value),
                }}
              >
                <option value="">{I18n.t(attributeLabels.selectFulfillment)}</option>
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
              id="add-fulfillments"
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
