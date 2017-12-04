import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { nodeTypes } from './constants';
import { Bonus as BonusNode } from './Nodes';
import getSubFieldErrors from '../../../../../../../../utils/getSubFieldErrors';
import { nodeGroupTypes } from '../../constants';

class Container extends Component {
  static propTypes = {
    errors: PropTypes.object,
    disabled: PropTypes.bool,
    activeNodes: PropTypes.array,
    allowedCustomValueTypes: PropTypes.array.isRequired,
  };

  static defaultProps = {
    errors: {},
    disabled: false,
    activeNodes: [],
  };

  renderNode = (node) => {
    const {
      allowedCustomValueTypes,
      errors,
      disabled,
    } = this.props;

    const nodePath = `${nodeGroupTypes.rewards}.${nodeTypes.bonus}`;

    switch (node) {
      case nodeTypes.bonus:
        return (
          <BonusNode
            disabled={disabled}
            errors={getSubFieldErrors(errors, `${nodeGroupTypes.rewards}.${nodeTypes.bonus}`)}
            typeValues={allowedCustomValueTypes}
            nodePath={nodePath}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { activeNodes } = this.props;

    return (
      <div className="col-lg-6 padding-bottom-30">
        {activeNodes.map(node =>
          <div key={node}>{this.renderNode(node)}</div>
        )}
      </div>
    );
  }
}

export default Container;
