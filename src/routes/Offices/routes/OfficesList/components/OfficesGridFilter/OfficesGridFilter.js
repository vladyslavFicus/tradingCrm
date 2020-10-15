import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'constants/propTypes';
import { filterLabels } from 'constants/user';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button } from 'components/UI';
import countryList from 'utils/countryList';
import './OfficesGridFilter.scss';

class OfficesGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
  };

  handleReset = (resetForm) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm({});
  };

  handleSubmit = (values, { setSubmitting }) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });

    setSubmitting(false);
  };

  render() {
    const { location: { state } } = this.props;

    return (
      <Formik
        enableReinitialize
        initialValues={state?.filters || {}}
        onSubmit={this.handleSubmit}
      >
        {({
          isSubmitting,
          resetForm,
          dirty,
        }) => (
          <Form className="OfficesGridFilter__form">
            <div className="OfficesGridFilter__fields">
              <Field
                name="keyword"
                className="OfficesGridFilter__field OfficesGridFilter__search"
                label={I18n.t(filterLabels.searchValue)}
                placeholder={I18n.t('COMMON.NAME')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
              />
              <Field
                name="country"
                className="OfficesGridFilter__field OfficesGridFilter__select"
                label={I18n.t(filterLabels.country)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                withAnyOption
                searchable
              >
                {Object.entries(countryList).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Field>
            </div>

            <div className="OfficesGridFilter__buttons">
              <Button
                className="OfficesGridFilter__button"
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting}
                common
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                className="OfficesGridFilter__button"
                disabled={isSubmitting || !dirty}
                type="submit"
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

export default withRouter(OfficesGridFilter);
