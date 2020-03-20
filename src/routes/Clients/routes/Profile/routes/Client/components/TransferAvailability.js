import React, { PureComponent, Fragment } from 'react';
import { graphql, compose } from 'react-apollo';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { withNotifications } from 'hoc';
import { SelectField } from 'components/ReduxForm';
import { updateConfigurationMutation } from 'graphql/mutations/profile';

class TransferAvailability extends PureComponent {
  static propTypes = {
    initialValues: PropTypes.shape({
      internalTransfer: PropTypes.number,
    }),
    notify: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
    initialValues: {},
  };

  handleChangeTransfer = async ({ internalTransfer }) => {
    const { playerUUID, updateConfiguration, notify } = this.props;
    const { error } = await updateConfiguration({
      variables: {
        playerUUID,
        internalTransfer: !!internalTransfer,
      },
    });

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.TITLE'),
      message: error
        ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY')
        : I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
    });
  };

  render() {
    const {
      handleSubmit,
      disabled,
    } = this.props;

    return (
      <Fragment>
        <div className="col personal-form-heading row margin-bottom-20">
          {I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.TITLE')}
        </div>
        <form onSubmit={handleSubmit(this.handleChangeTransfer)}>
          <div className="form-row">
            <Field
              name="internalTransfer"
              label={I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.LABEL')}
              disabled={disabled}
              component={SelectField}
              className="col-lg-6"
              normalize={value => parseInt(value, 10)}
            >
              <option key={2} value={0}>
                {I18n.t('COMMON.DISABLED')}
              </option>
              <option key={1} value={1}>
                {I18n.t('COMMON.ENABLED')}
              </option>
            </Field>
            <div className="col-4 mt-4-profile">
              <button type="submit" className="btn btn-primary width-full">
                {I18n.t('COMMON.BUTTONS.SAVE')}
              </button>
            </div>
          </div>
        </form>
      </Fragment>
    );
  }
}

export default compose(
  withNotifications,
  reduxForm({
    form: 'transferAvailability',
    enableReinitialize: true,
  }),
  graphql(updateConfigurationMutation, {
    name: 'updateConfiguration',
  }),
)(TransferAvailability);
