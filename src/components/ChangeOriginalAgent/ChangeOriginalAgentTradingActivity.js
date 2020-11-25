import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import compose from 'compose-function';
import { Formik, Form, Field } from 'formik';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { withNotifications } from 'hoc';
import { withRequests } from 'apollo';
import { Button } from 'components/UI';
import { FormikSelectField } from 'components/Formik';
import { OperatorsQuery, ChangeOriginalAgentTradingActivityMutation } from './graphql';

class ChangeOriginalAgent extends PureComponent {
  static propTypes = {
    changeOriginalAgent: PropTypes.func.isRequired,
    operators: PropTypes.object.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    tradeId: PropTypes.number.isRequired,
    platformType: PropTypes.string.isRequired,
    agentId: PropTypes.string,
  };

  static defaultProps = {
    agentId: '',
  };

  handleChangeOriginalAgent = async ({ agentId }) => {
    const { tradeId, notify, platformType } = this.props;

    try {
      await this.props.changeOriginalAgent({
        variables: {
          tradeId,
          agentId,
          platformType,
        },
      });

      notify({
        level: 'success',
        message: I18n.t('TRADING_ACTIVITY_MODAL.NOTIFICATIONS.SUCCESSFULLY'),
      });

      this.props.onCloseModal();
      this.props.onSuccess();
    } catch {
      notify({
        level: 'error',
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  render() {
    const {
      operators,
      operators: { loading },
      agentId,
    } = this.props;
    const operatorsList = get(operators, 'data.operators.content') || [];

    return (
      <div className="col">
        <div className="modal-tab-label">
          {I18n.t('CHANGE_ORIGINAL_AGENT.TITLE')}
        </div>
        <Formik
          initialValues={{ agentId }}
          onSubmit={this.handleChangeOriginalAgent}
        >
          {({ isSubmitting, dirty }) => (
            <Form>
              <Field
                name="agentId"
                component={FormikSelectField}
                disabled={loading}
              >
                {operatorsList.map(({ uuid, fullName, operatorStatus }) => (
                  <option key={uuid} value={uuid} disabled={operatorStatus !== 'ACTIVE'}>
                    {fullName}
                  </option>
                ))}
              </Field>
              <Button
                small
                primary
                className="pull-right"
                type="submit"
                disabled={!dirty || isSubmitting}
              >
                {I18n.t('COMMON.SAVE')}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    operators: OperatorsQuery,
    changeOriginalAgent: ChangeOriginalAgentTradingActivityMutation,
  }),
)(ChangeOriginalAgent);
