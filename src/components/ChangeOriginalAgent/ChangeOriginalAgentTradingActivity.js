import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Field, reduxForm } from 'redux-form';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { withNotifications } from 'hoc';
import { operatorsQuery } from 'graphql/queries/operators';
import { changeOriginalAgent } from 'graphql/mutations/tradingActivity';
import { NasSelectField } from '../ReduxForm/index';


class ChangeOriginalAgent extends PureComponent {
  static propTypes = {
    changeOriginalAgent: PropTypes.func.isRequired,
    operators: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.any,
    submitting: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
  };

  static defaultProps = {
    error: null,
  };

  handleChangeOriginalAgent = async ({ agentId }) => {
    const { tradeId, notify } = this.props;

    const {
      data: { tradingActivity: { changeOriginalAgent: { success } } },
    } = await this.props.changeOriginalAgent({
      variables: {
        tradeId,
        agentId,
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
      handleSubmit,
      error,
      submitting,
      valid,
      pristine,
    } = this.props;
    const operatorsList = get(operators, 'operators.data.content', []);

    return (
      <div className="col">
        <div className="modal-tab-label">
          {I18n.t('CHANGE_ORIGINAL_AGENT.TITLE')}
        </div>
        <form
          onSubmit={handleSubmit(this.handleChangeOriginalAgent)}
        >
          <Field
            name="agentId"
            label=""
            component={NasSelectField}
            className="filter-row__small"
            disabled={loading}
          >
            {operatorsList.map(item => (
              <option key={item.uuid} value={item.uuid}>{item.fullName}</option>
            ))}
          </Field>
          <button
            className="btn btn-sm btn-primary pull-right"
            type="submit"
            disabled={pristine || submitting || !!error || !valid}
          >
            {I18n.t('COMMON.SAVE')}
          </button>
        </form>
      </div>
    );
  }
}

export default compose(
  withNotifications,
  reduxForm({
    form: 'ChangeOriginalAgentForm',
  }),
  graphql(operatorsQuery, {
    name: 'operators',
  }),
  graphql(changeOriginalAgent, {
    name: 'changeOriginalAgent',
  }),
)(ChangeOriginalAgent);
