import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import {
  InputField, SelectField, CustomValueFieldVertical,
} from '../../../../../../../../../components/ReduxForm';
import renderLabel from '../../../../../../../../../utils/renderLabel';
import { attributeLabels, attributePlaceholders } from './constants';
import { multipliersTypes, moneyTypePrior } from '../../../../../../../../../constants/bonus-campaigns';

const BonusReward = ({ basename, typeValues, limits, modalOpen }) => (
  <div className="add-campaign-container">
    <div className="add-campaign-label">
      {I18n.t(attributeLabels.bonusReward)}
    </div>
    <div className="form-row">
      <div className="form-row__medium">
        <CustomValueFieldVertical
          basename={basename}
          label={I18n.t(attributeLabels.grant)}
          typeValues={typeValues}
          modalOpen={modalOpen}
        />
      </div>
      {
        limits &&
        <div className="form-row__medium">
          <label>{I18n.t(attributeLabels.limits)}</label>
          <div className="range-group">
            <Field
              name="limitMin"
              type="text"
              placeholder={I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.MIN_AMOUNT_PLACEHOLDER')}
              component={InputField}
              position="vertical"
              iconRightClassName="nas nas-currencies_icon"
              onIconClick={modalOpen}
            />
            <span className="range-group__separator">-</span>
            <Field
              name="limitMax"
              type="text"
              placeholder={I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.MAX_AMOUNT_PLACEHOLDER')}
              component={InputField}
              position="vertical"
              iconRightClassName="nas nas-currencies_icon"
              onIconClick={modalOpen}
            />
          </div>
        </div>
      }
    </div>
    <div className="form-row">
      <div className="form-row__small">
        <Field
          name="wagerWinMultiplier"
          type="text"
          placeholder="0.00"
          label={I18n.t(attributeLabels.multiplier)}
          component={InputField}
          position="vertical"
        />
      </div>
      <div className="form-row__multiplier">
        X
      </div>
      <div className="form-row__medium">
        <Field
          name="multipliersType"
          type="text"
          label={I18n.t(attributeLabels.multipliersType)}
          component={SelectField}
          position="vertical"
        >
          {Object.keys(multipliersTypes).map(key => (
            <option key={key} value={key}>
              {renderLabel(key, multipliersTypes)}
            </option>
          ))}
        </Field>
      </div>
      <div className="form-row__medium">
        <Field
          name="multipliersType"
          type="text"
          label={I18n.t(attributeLabels.moneyPrior)}
          component={SelectField}
          position="vertical"
        >
          {Object.keys(moneyTypePrior).map(key => (
            <option key={key} value={key}>
              {renderLabel(key, moneyTypePrior)}
            </option>
          ))}
        </Field>
      </div>
    </div>
    <div className="form-row">
      <div className="form-row__small">
        <Field
          name="bmBetLimit"
          type="text"
          placeholder="0.00"
          label={I18n.t(attributeLabels.bmBetLimit)}
          component={InputField}
          position="vertical"
          iconRightClassName="nas nas-currencies_icon"
          onIconClick={modalOpen}
        />
      </div>
      <div className="form-row__small form-row_with-placeholder-right">
        <Field
          name="lifeTime"
          type="text"
          placeholder="0"
          label={I18n.t(attributeLabels.lifeTime)}
          component={InputField}
          position="vertical"
        />
        <span className="right-placeholder">{I18n.t(attributePlaceholders.days)}</span>
      </div>
      <div className="form-row__small form-row_with-placeholder-right">
        <Field
          name="customContribRate"
          type="text"
          placeholder={I18n.t(attributePlaceholders.notSet)}
          label={I18n.t(attributeLabels.customContribRate)}
          component={InputField}
          position="vertical"
        />
        <span className="right-placeholder">%</span>
      </div>
    </div>
    <button className="btn-transparent add-campaign-remove">&times;</button>
  </div>
);

BonusReward.propTypes = {
  basename: PropTypes.string.isRequired,
  typeValues: PropTypes.array.isRequired,
  limits: PropTypes.bool,
  modalOpen: PropTypes.func,
  onClick: PropTypes.func,
};
BonusReward.defaultProps = {
  limits: true,
  modalOpen: null,
};

export default BonusReward;
