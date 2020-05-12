import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
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
    agentId: PropTypes.string,
  };

  static defaultProps = {
    agentId: '',
  };

  handleChangeOriginalAgent = async ({ agentId }) => {
    const { tradeId, notify, platformType } = this.props;

    const {
      data: { tradingActivity: { changeOriginalAgent: { success } } },
    } = await this.props.changeOriginalAgent({
      variables: {
        tradeId,
        agentId,
        platformType,
      },
    });

    notify({
      level: success ? 'success' : 'error',
      message: success
        ? I18n.t('TRADING_ACTIVITY_MODAL.NOTIFICATIONS.SUCCESSFULLY')
        : I18n.t('COMMON.SOMETHING_WRONG'),
    });

    if (success) {
      this.props.onCloseModal();
      this.props.onSuccess();
    }
  }

  render() {
    const {
      operators,
      operators: { loading },
      agentId,
    } = this.props;
    const operatorsList = get(operators, 'data.operators.data.content') || [];

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
                {operatorsList.map(({ uuid, fullName }) => (
                  <option key={uuid} value={uuid}>{fullName}</option>
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
