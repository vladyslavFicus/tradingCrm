import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';

const FilterActions = ({ onResetClick, submitDisabled, resetDisabled }) => {
  return (
    <div className="button-block-container">
      <button
        disabled={resetDisabled}
        className="btn btn-default"
        onClick={onResetClick}
        type="reset"
      >
        {I18n.t('COMMON.RESET')}
      </button>
      <button
        id="users-list-apply-button"
        disabled={submitDisabled}
        className="btn btn-primary"
        type="submit"
      >
        {I18n.t('COMMON.APPLY')}
      </button>
    </div>
  );
};
FilterActions.propTypes = {
  onResetClick: PropTypes.func.isRequired,
  submitDisabled: PropTypes.bool,
  resetDisabled: PropTypes.bool,
};
FilterActions.defaultProps = {
  submitDisabled: false,
  resetDisabled: false,
};

export default FilterActions;
