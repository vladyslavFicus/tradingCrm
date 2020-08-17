import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withFormik, Form, Field } from 'formik';
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
    resetForm: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    filesCategories: PropTypes.shape({
      DOCUMENT_VERIFICATION: PropTypes.arrayOf(PropTypes.string),
      ADRESS_VERIFICATION: PropTypes.arrayOf(PropTypes.string),
      OTHER: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  };

  handleReset = () => {
    const { history, resetForm } = this.props;

    history.replace({ query: { filters: {} } });
    resetForm({});
  };

  handleVerificationTypeChange = (value) => {
    const { setFieldValue } = this.props;

    setFieldValue('verificationType', value);

    if (value === 'OTHER') {
      setFieldValue('documentType', value);
    } else {
      setFieldValue('documentType', '');
    }
  }

  render() {
    const {
      isSubmitting,
      dirty,
      filesCategories,
      values: { verificationType },
    } = this.props;

    const categoriesData = get(filesCategories, 'data.filesCategories') || {};
    const categories = omit(categoriesData, '__typename');

    const verificationTypes = Object.keys(categories);
    const documentTypes = verificationType ? categories[verificationType] : [];

    return (
      <Form className="FilesGridFilter">
        <div className="FilesGridFilter__inputs">
          <Field
            name="searchBy"
            className="FilesGridFilter__input FilesGridFilter__search"
            label={I18n.t('FILES.FILTER.SEARCH_BY')}
            placeholder={I18n.t('FILES.FILTER.SEARCH_BY_PLACEHOLDER')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
          />
          <Field
            name="verificationType"
            className="FilesGridFilter__input FilesGridFilter__select"
            placeholder={I18n.t('FILES.FILTER.CATEGORY_PLACEHOLDER')}
            label={I18n.t('FILES.FILTER.CATEGORY')}
            component={FormikSelectField}
            customOnChange={this.handleVerificationTypeChange}
            searchable
            withAnyOption
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
            disabled={!verificationType || verificationType === 'OTHER'}
            searchable
            withAnyOption
          >
            {documentTypes.map(item => (
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
          />
        </div>

        <div className="FilesGridFilter__buttons">
          <Button
            className="FilesGridFilter__button"
            onClick={this.handleReset}
            disabled={isSubmitting}
            common
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
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    filesCategories: FilesCategoriesQuery,
  }),
  withFormik({
    mapPropsToValues: () => ({
      searchBy: '',
    }),
    handleSubmit: (values, { props, setSubmitting }) => {
      props.history.replace({
        query: {
          filters: decodeNullValues(values),
        },
      });
      setSubmitting(false);
    },
  }),
)(FilesGridFilter);
