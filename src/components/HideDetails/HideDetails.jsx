import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import './HideDetails.scss';

const HideDetails = ({ onClick, informationShown }) => (
  <div className="row no-gutters hide-details">
    <div className="col hide-details__divider" />
    <button
      className="col-auto px-3 btn-transparent hide-details__action"
      onClick={onClick}
    >
      <Choose>
        <When condition={informationShown}>
          {I18n.t('COMMON.DETAILS_COLLAPSE.HIDE')}
        </When>
        <Otherwise>
          {I18n.t('COMMON.DETAILS_COLLAPSE.SHOW')}
        </Otherwise>
      </Choose>
    </button>
    <div className="col hide-details__divider" />
  </div>
);

HideDetails.propTypes = {
  onClick: PropTypes.func.isRequired,
  informationShown: PropTypes.bool.isRequired,
};

export default HideDetails;
