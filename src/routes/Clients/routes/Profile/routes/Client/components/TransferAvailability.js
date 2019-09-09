import React, { PureComponent, Fragment } from 'react';
import { graphql, compose } from 'react-apollo';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { withNotifications } from 'components/HighOrder';
import { SelectField } from 'components/ReduxForm';
import { updateMutation } from 'graphql/mutations/profile';

class TransferAvailability extends PureComponent {
  static propTypes = {
    initialValues: PropTypes.shape({
      enableInternalTransfer: PropTypes.number,
    }),
    notify: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
    initialValues: {},
  };

  handleChangeTransfer = async ({ enableInternalTransfer }) => {
    const { playerUUID, profileUpdate, notify } = this.props;
    const { error } = await profileUpdate({
      variables: {
        playerUUID,
        enableInternalTransfer: !!enableInternalTransfer,
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
              name="enableInternalTransfer"
              label={I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.LABEL')}
              disabled={disabled}
              component={SelectField}
              className="col-lg-6"
              normalize={value => parseInt(value, 10)}
            >
              <option key={1} value={1}>
                {I18n.t('COMMON.ENABLED')}
              </option>
              <option key={2} value={0}>
                {I18n.t('COMMON.DISABLED')}
              </option>
            </Field>
            <div className="col-4 mt-4">
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
  graphql(updateMutation, {
    name: 'profileUpdate',
  }),
)(TransferAvailability);
