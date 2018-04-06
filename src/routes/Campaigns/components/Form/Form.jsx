import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { InputField } from '../../../../components/ReduxForm';
import { attributeLabels, rewardTypes, rewardTypesLabels } from '../../constants';
import { withReduxFormValues } from '../../../../components/HighOrder';
import NodeBuilder from '../NodeBuilder';
import { BonusView } from '../Bonus';
import { FreeSpinView } from '../FreeSpin';
import './Form.scss';

const CAMPAIGN_NAME_MAX_LENGTH = 100;

class Form extends Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    form: PropTypes.string.isRequired,
    freeSpins: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string,
    })),
    bonuses: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string,
    })),
    currentValues: PropTypes.shape({
      name: PropTypes.string,
    }),
  };

  static defaultProps = {
    handleSubmit: null,
    freeSpins: [],
    bonuses: [],
    pristine: false,
    submitting: false,
    currentValues: {},
  };

  handleRevert = () => {
    this.props.reset();
  };

  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
      currentValues,
      form,
      freeSpins,
      bonuses,
    } = this.props;

    return (
      <form id={form} className="campaign-settings" onSubmit={handleSubmit(onSubmit)}>
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6 text-truncate campaign-settings__title">
              {I18n.t('BONUS_CAMPAIGNS.SETTINGS.CAMPAIGN_SETTINGS')}
            </div>
            {
              !pristine &&
              <div className="col-md-6 text-md-right">
                <button
                  disabled={submitting}
                  onClick={this.handleRevert}
                  className="btn btn-default-outline text-uppercase margin-right-20"
                  type="button"
                >
                  {I18n.t('COMMON.REVERT_CHANGES')}
                </button>
                <button
                  disabled={submitting}
                  className="btn btn-primary text-uppercase"
                  type="submit"
                  id="bonus-campaign-save-button"
                >
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </button>
              </div>
            }
          </div>
          <hr />
          <div className="row">
            <div className="col-md-7">
              <Field
                id={`${form}Name`}
                name="name"
                label={I18n.t(attributeLabels.campaignName)}
                type="text"
                component={InputField}
                position="vertical"
                disabled={submitting}
              />
              <div className="form-group__note">
                {
                  currentValues && currentValues.name
                    ? currentValues.name.length
                    : 0
                }/{CAMPAIGN_NAME_MAX_LENGTH}
              </div>
            </div>
          </div>
          <NodeBuilder
            options={[
              { type: rewardTypes.BONUS, items: bonuses, component: BonusView },
              { type: rewardTypes.FREE_SPIN, items: freeSpins, component: FreeSpinView },
            ]}
            typeLabels={rewardTypesLabels}
            types={Object.keys(rewardTypes)}
          />
        </div>
      </form>
    );
  }
}

export default compose(
  reduxForm({
    enableReinitialize: true,
  }),
  withReduxFormValues
)(Form);
