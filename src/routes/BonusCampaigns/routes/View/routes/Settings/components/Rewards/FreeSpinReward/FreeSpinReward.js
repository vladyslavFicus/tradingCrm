import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { InputField, SelectField } from '../../../../../../../../../components/ReduxForm/index';
import renderLabel from '../../../../../../../../../utils/renderLabel';
import { attributeLabels, attributePlaceholders } from './constants';
import {
  provider, games, lines, coins, coinValues, multipliersTypes, moneyTypePrior,
} from '../../../../../../../../../constants/bonus-campaigns';

const FreeSpinReward = ({ netEnt }) => (
  <div className="add-campaign-container">
    <div className="add-campaign-label">
      {I18n.t(attributeLabels.freeSpinReward)}
    </div>
    <div className="filter-row">
      <div className="filter-row__big">
        <Field
          name="provider"
          type="text"
          label={I18n.t(attributeLabels.provider)}
          component={SelectField}
          position="vertical"
        >
          {Object.keys(provider).map(key => (
            <option key={key} value={key}>
              {renderLabel(key, provider)}
            </option>
          ))}
        </Field>
      </div>
      <div className="filter-row__big">
        <Field
          name="games"
          type="text"
          label={I18n.t(attributeLabels.games)}
          component={SelectField}
          position="vertical"
        >
          {Object.keys(games).map(key => (
            <option key={key} value={key}>
              {renderLabel(key, games)}
            </option>
          ))}
        </Field>
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-lg-8">
        <div className="form-row">
          <div className="form-row__small">
            <Field
              name="freeSpins"
              type="text"
              placeholder="10"
              label={I18n.t(attributeLabels.freeSpins)}
              component={InputField}
              position="vertical"
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
        </div>
        <div className="form-row">
          <div className="form-row__small">
            <Field
              name="lines"
              type="text"
              label={I18n.t(attributeLabels.lines)}
              component={SelectField}
              position="vertical"
            >
              {Object.keys(lines).map(key => (
                <option key={key} value={key}>
                  {renderLabel(key, lines)}
                </option>
              ))}
            </Field>
          </div>
          {
            netEnt &&
            <div className="form-row__small">
              <Field
                name="coins"
                type="text"
                label={I18n.t(attributeLabels.coins)}
                component={SelectField}
                position="vertical"
              >
                {Object.keys(coins).map(key => (
                  <option key={key} value={key}>
                    {renderLabel(key, coins)}
                  </option>
                ))}
              </Field>
            </div>
          }
          {
            netEnt &&
            <div className="form-row__small">
              <Field
                name="coinValue"
                type="text"
                label={I18n.t(attributeLabels.coinValue)}
                component={SelectField}
                position="vertical"
              >
                {Object.keys(coinValues).map(key => (
                  <option key={key} value={key}>
                    {renderLabel(key, coinValues)}
                  </option>
                ))}
              </Field>
            </div>
          }
          {
            !netEnt &&
            <div className="form-row__small">
              <Field
                name="perLineValue"
                type="text"
                label={I18n.t(attributeLabels.perLine)}
                component={SelectField}
                position="vertical"
              >
                {Object.keys(coinValues).map(key => (
                  <option key={key} value={key}>
                    {renderLabel(key, coinValues)}
                  </option>
                ))}
              </Field>
            </div>
          }
        </div>
      </div>
      <div className="col-lg-4">
        <div className="free-spin-card__wrapper">
          <div className="free-spin-card">
            <div className="free-spin-card-values">1,00</div>
            <div className="free-spin-card-values">EUR</div>
            <div className="free-spin-card-label">{I18n.t(attributeLabels.spinValue)}</div>
          </div>
          <div className="free-spin-card">
            <div className="free-spin-card-values">10,00</div>
            <div className="free-spin-card-values">EUR</div>
            <div className="free-spin-card-label">{I18n.t(attributeLabels.totalValue)}</div>
          </div>
        </div>
      </div>
    </div>
    <hr />
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

FreeSpinReward.propTypes = {
  netEnt: PropTypes.bool,
};

FreeSpinReward.defaultProps = {
  netEnt: true,
};

export default FreeSpinReward;
