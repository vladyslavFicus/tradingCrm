import React, { Component } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { SubmissionError } from 'redux-form';
import PropTypes from '../../../../../../../constants/propTypes';
import TabHeader from '../../../../../../../components/TabHeader';
import PersonalForm from './PersonalForm';
import AddressForm from './AddressForm';
import ContactForm from './ContactForm';
import './View.scss';

class View extends Component {
  static propTypes = {
    leadProfile: PropTypes.shape({
      leadProfile: PropTypes.shape({
        data: PropTypes.lead,
        error: PropTypes.object,
      }),
    }).isRequired,
    updateLead: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    dirty: PropTypes.bool,
    error: PropTypes.any,
  };

  static defaultProps = {
    submitting: false,
    valid: false,
    dirty: false,
    error: null,
  };

  handleUpdateLead = async (variables) => {
    const { notify, updateLead } = this.props;
    const { data: { leads: { update: { error } } } } = await updateLead({
      variables,
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('LEAD_PROFILE.NOTIFICATION_FAILURE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
      throw new SubmissionError({ _error: error.error });
    } else {
      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('LEAD_PROFILE.UPDATED'),
      });
    }
  };

  render() {
    const {
      leadProfile: {
        leadProfile,
      },
      handleSubmit,
      submitting,
      valid,
      dirty,
      error: formError,
    } = this.props;

    const error = get(leadProfile, 'error');

    if (error) {
      return null;
    }

    return (
      <form onSubmit={handleSubmit(this.handleUpdateLead)}>
        <TabHeader title={I18n.t('PLAYER_PROFILE.PROFILE.TITLE')}>
          <If condition={dirty && !submitting && valid}>
            <button
              type="submit"
              className="btn btn-sm btn-primary-outline"
            >
              {I18n.t('COMMON.SAVE_CHANGES')}
            </button>
          </If>
        </TabHeader>
        <If condition={formError}>
          <div className="mb-2 font-weight-700 color-danger text-center">
            {formError}
          </div>
        </If>
        <div className="tab-wrapper">
          <div className="card">
            <div className="card-body row">
              <div className="col">
                <PersonalForm />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body row">
              <div className="col">
                <AddressForm />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body row">
              <div className="col">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default View;
