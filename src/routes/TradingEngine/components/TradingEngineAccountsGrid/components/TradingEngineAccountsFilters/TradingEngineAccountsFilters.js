import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'constants/propTypes';
import { FormikInputField } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI';
import './TradingEngineAccountsFilters.scss';

class TradingEngineAccountsFilters extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    loading: PropTypes.bool,
    handleRefetch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loading: false,
  };

  handleSubmit = (values) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  handleReset = (resetForm) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm();
  };

  render() {
    const {
      loading,
      handleRefetch,
      location: { state },
    } = this.props;

    return (
      <Formik
        enableReinitialize
        initialValues={state?.filters || {}}
        onSubmit={this.handleSubmit}
      >
        {({
          isSubmitting,
          resetForm,
          values,
          dirty,
        }) => (
          <Form className="filter__form">
            <div className="filter__form-inputs">
              <Field
                name="keyword"
                label={I18n.t('TRADING_ENGINE.ACCOUNTS.FORM.FIELDS.SEARCH_BY')}
                placeholder={I18n.t('TRADING_ENGINE.ACCOUNTS.FORM.FIELDS.SEARCH_BY_PLACEHOLDER')}
                className="form-group filter-row__big"
                component={FormikInputField}
                addition={<i className="icon icon-search" />}
                withFocus
              />
            </div>
            <div className="TradingEngineAccountsFilters__buttons">
              <RefreshButton
                className="TradingEngineAccountsFilters__button"
                onClick={handleRefetch}
              />

              <Button
                className="TradingEngineAccountsFilters__button"
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                className="TradingEngineAccountsFilters__button"
                type="submit"
                disabled={loading || isSubmitting || !dirty}
                primary
              >
                {I18n.t('COMMON.APPLY')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default withRouter(TradingEngineAccountsFilters);
