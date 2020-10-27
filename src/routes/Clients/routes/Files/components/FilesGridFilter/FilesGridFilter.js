import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { Form, Field, Formik } from 'formik';
import { get, omit } from 'lodash';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikSelectField, FormikDateRangeGroup } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button } from 'components/UI';
import FilesCategoriesQuery from './graphql/FilesCategoriesQuery';
import './FilesGridFilter.scss';

class FilesGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    filesCategories: PropTypes.shape({
      DOCUMENT_VERIFICATION: PropTypes.arrayOf(PropTypes.string),
      ADRESS_VERIFICATION: PropTypes.arrayOf(PropTypes.string),
      OTHER: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
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

  handleVerificationTypeChange = (value, setFieldValue) => {
    setFieldValue('verificationType', value);

    if (value === 'OTHER') {
      setFieldValue('documentType', value);
    } else {
      setFieldValue('documentType', '');
    }
  }

  render() {
    const {
      filesCategories,
      location: { state },
    } = this.props;

    const categoriesData = get(filesCategories, 'data.filesCategories') || {};
    const categories = omit(categoriesData, '__typename');

    const verificationTypes = Object.keys(categories);

    return (
      <Formik
        enableReinitialize
        initialValues={state?.filters || {}}
        onSubmit={this.handleSubmit}
      >
        {({ dirty, isSubmitting, values, setFieldValue, resetForm }) => (
          <Form className="FilesGridFilter">
            <div className="FilesGridFilter__inputs">
              <Field
                name="searchBy"
                className="FilesGridFilter__input FilesGridFilter__search"
                label={I18n.t('FILES.FILTER.SEARCH_BY')}
                placeholder={I18n.t('FILES.FILTER.SEARCH_BY_PLACEHOLDER')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
                withFocus
              />
              <Field
                name="verificationType"
                className="FilesGridFilter__input FilesGridFilter__select"
                placeholder={I18n.t('FILES.FILTER.CATEGORY_PLACEHOLDER')}
                label={I18n.t('FILES.FILTER.CATEGORY')}
                component={FormikSelectField}
                customOnChange={value => this.handleVerificationTypeChange(value, setFieldValue)}
                searchable
                withAnyOption
                withFocus
              >
                {verificationTypes.map(item => (
                  <option key={item} value={item}>
                    {I18n.t(`FILES.CATEGORIES.${item}`)}
                  </option>
                ))}
              </Field>
              <Field
                name="documentType"
                className="FilesGridFilter__input FilesGridFilter__select"
                placeholder={I18n.t('FILES.FILTER.DOCUMENT_TYPE_PLACEHOLDER')}
                label={I18n.t('FILES.FILTER.DOCUMENT_TYPE')}
                component={FormikSelectField}
                disabled={!values.verificationType || values.verificationType === 'OTHER'}
                searchable
                withAnyOption
                withFocus
              >
                {(categories[values.verificationType] || []).map(item => (
                  <option key={item} value={item}>
                    {I18n.t(`FILES.DOCUMENT_TYPES.${item}`)}
                  </option>
                ))}
              </Field>
              <FormikDateRangeGroup
                className="FilesGridFilter__input FilesGridFilter__dates"
                label={I18n.t('FILES.FILTER.UPLOAD_DATA_RANGE')}
                periodKeys={{
                  start: 'uploadedDateFrom',
                  end: 'uploadedDateTo',
                }}
                withFocus
              />
            </div>

            <div className="FilesGridFilter__buttons">
              <Button
                className="FilesGridFilter__button"
                onClick={() => this.handleReset(resetForm)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="FilesGridFilter__button"
                disabled={!dirty || isSubmitting}
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

export default compose(
  withRouter,
  withRequests({
    filesCategories: FilesCategoriesQuery,
  }),
)(FilesGridFilter);
