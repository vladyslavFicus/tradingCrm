import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import moment from 'moment';
import I18n from 'i18n-js';
import { createValidator, translateLabels } from 'utils/validator';
import PropTypes from 'constants/propTypes';
import { InputField, DateTimeField, RangeGroup, NasSelectField } from 'components/ReduxForm';
import { attributeLabels } from '../constants';

class FileListFilterForm extends Component {
  static propTypes = {
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    currentValues: PropTypes.object,
    invalid: PropTypes.bool,
    categories: PropTypes.shape({
      DOCUMENT_VERIFICATION: PropTypes.arrayOf(PropTypes.string),
      ADRESS_VERIFICATION: PropTypes.arrayOf(PropTypes.string),
    }),
  };

  static defaultProps = {
    currentValues: {},
    invalid: true,
    categories: {},
  };

  state = {
    selectedCategory: null,
  }

  handleReset = () => {
    this.props.reset();
    this.props.onSubmit();

    this.setState({ selectedCategory: null });
  };

  startDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.uploadedDateTo
      ? current.isSameOrBefore(moment(currentValues.uploadedDateTo))
      : true;
  };

  endDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.uploadedDateFrom
      ? current.isSameOrAfter(moment(currentValues.uploadedDateFrom))
      : true;
  };

  render() {
    const {
      submitting,
      handleSubmit,
      onSubmit,
      invalid,
      categories,
    } = this.props;

    const { selectedCategory } = this.state;
    const documentTypes = selectedCategory ? categories[selectedCategory] : [''];

    return (
      <form className="filter-row" onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="searchBy"
          type="text"
          label={I18n.t(attributeLabels.keyword)}
          placeholder="Name, UUID"
          component={InputField}
          inputAddon={<i className="icon icon-search" />}
          className="filter-row__big"
        />
        <Field
          placeholder={I18n.t('FILES.UPLOAD_MODAL.FILE.CATEGORY_DEFAULT_OPTION')}
          name="verificationType"
          component={NasSelectField}
          onChange={(_, value) => this.setState({ selectedCategory: value })}
          searchable={false}
          label={I18n.t('FILES.UPLOAD_MODAL.FILE.CATEGORY')}
        >
          {Object.keys(categories).map(item => (
            <option key={item} value={item}>
              {I18n.t(`FILES.CATEGORIES.${item}`)}
            </option>
          ))}
        </Field>
        <Field
          placeholder={I18n.t('FILES.UPLOAD_MODAL.FILE.DOCUMENT_TYPE_DEFAULT_OPTION')}
          name="documentType"
          disabled={!selectedCategory}
          component={NasSelectField}
          searchable={false}
          label={I18n.t('FILES.UPLOAD_MODAL.FILE.DOCUMENT_TYPE')}
        >
          {documentTypes.map(item => (
            <option key={item} value={item}>
              {item ? I18n.t(`FILES.DOCUMENT_TYPES.${item}`) : item}
            </option>
          ))}
        </Field>
        <RangeGroup
          className="filter-row__dates"
          label={I18n.t('FILES.FILTER.UPLOAD_DATA_RANGE')}
        >
          <Field
            name="uploadedDateFrom"
            placeholder={I18n.t(attributeLabels.uploadedDateFrom)}
            component={DateTimeField}
            isValidDate={this.startDateValidator}
            pickerClassName="left-side"
            timePresets
            withTime
          />
          <Field
            name="uploadedDateTo"
            placeholder={I18n.t(attributeLabels.uploadedDateTo)}
            component={DateTimeField}
            isValidDate={this.endDateValidator}
            isDateRangeEndValue
            timePresets
            withTime
          />
        </RangeGroup>
        <div className="filter-row__button-block">
          <button
            disabled={submitting}
            className="btn btn-default"
            onClick={this.handleReset}
            type="button"
          >
            {I18n.t('COMMON.RESET')}
          </button>
          <button
            disabled={submitting || invalid}
            className="btn btn-primary"
            type="submit"
          >
            {I18n.t('COMMON.APPLY')}
          </button>
        </div>
      </form>
    );
  }
}

const FORM_NAME = 'userFilesFilter';

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(reduxForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: createValidator({
    searchBy: 'string',
    uploadedDateFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    uploadedDateTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
  }, translateLabels(attributeLabels), false),
})(FileListFilterForm));
