import React from 'react';
import PropTypes from 'prop-types';

export default function withMultiCurrencyModal(WrappedComponent) {
  const MultiCurrencyModalWrapper = (props, context) => (
    <WrappedComponent {...props} modals={context.modals} />
  );
  MultiCurrencyModalWrapper.contextTypes = {
    modals: PropTypes.shape({
      multiCurrencyModal: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
  };

  return MultiCurrencyModalWrapper;
}
