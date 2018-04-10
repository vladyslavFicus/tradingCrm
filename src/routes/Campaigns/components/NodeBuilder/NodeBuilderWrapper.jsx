import React from 'react';
import { FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import NodeBuilder from './NodeBuilder';

const NodeBuilderWrapper = props => <FieldArray name={props.name} props={props} component={NodeBuilder} />;

NodeBuilderWrapper.propTypes = {
  name: PropTypes.string.isRequired,
};

export default NodeBuilderWrapper;

