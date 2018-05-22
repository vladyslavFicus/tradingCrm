import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { createValidator } from '../../../../../utils/validator';
import createDynamicForm, { FilterItem, FilterField, TYPES, SIZES } from '../../../../../components/DynamicFilters';
import renderLabel from '../../../../../utils/renderLabel';
import { filterLabels, filterPlaceholders } from '../constants';
import {
  statusesLabels,
  fulfillmentTypesLabels,
  rewardTypesLabels,
} from '../../../../../constants/campaigns';

const FORM_NAME = 'campaignGridViewFilter';
const DynamicFilters = createDynamicForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: createValidator({
    searchBy: 'string',
    status: 'string',
    fulfillmentType: 'string',
    campaignType: 'string',
    creationDateFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    creationDateTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    activityDateFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    activityDateTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
  }, filterLabels, false),
});

class CampaignGridViewFilter extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.objectOf(PropTypes.string).isRequired,
    formValues: PropTypes.objectOf(PropTypes.string).isRequired,
  };
  static defaultProps = {
    disabled: false,
  };

  startDateValidator = toAttribute => (current) => {
    const { formValues } = this.props;

    return formValues && formValues[toAttribute]
      ? current.isSameOrBefore(moment(formValues[toAttribute]))
      : true;
  };

  endDateValidator = fromAttribute => (current) => {
    const { formValues } = this.props;

    return formValues && formValues[fromAttribute]
      ? current.isSameOrAfter(moment(formValues[fromAttribute]))
      : true;
  };

  render() {
    const {
      onSubmit,
      onReset,
      disabled,
      initialValues,
    } = this.props;

    return (
      <DynamicFilters
        allowSubmit={disabled}
        allowReset={disabled}
        onSubmit={onSubmit}
        onReset={onReset}
        initialValues={initialValues}
      >
        <FilterItem label={filterLabels.searchBy} size={SIZES.big} type={TYPES.input} default>
          <FilterField
            id="campaign-search-field"
            name="searchBy"
            label={I18n.t(filterLabels.searchBy)}
            placeholder={I18n.t(filterPlaceholders.searchBy)}
            type="text"
          />
        </FilterItem>

        <FilterItem label={I18n.t(filterLabels.status)} size={SIZES.small} type={TYPES.select} default>
          <FilterField name="status">
            <option value="">{I18n.t('COMMON.ANY')}</option>
            {Object.keys(statusesLabels).map(status => (
              <option key={status} value={status}>
                {renderLabel(status, statusesLabels)}
              </option>
            ))}
          </FilterField>
        </FilterItem>

        <FilterItem label={I18n.t(filterLabels.fulfillmentType)} size={SIZES.small} type={TYPES.select} default>
          <FilterField name="fulfillmentType">
            <option value="">{I18n.t('COMMON.ANY')}</option>
            {Object.keys(fulfillmentTypesLabels).map(fulfillmentType => (
              <option key={fulfillmentType} value={fulfillmentType}>
                {renderLabel(fulfillmentType, fulfillmentTypesLabels)}
              </option>
            ))}
          </FilterField>
        </FilterItem>

        <FilterItem label={I18n.t(filterLabels.campaignType)} size={SIZES.small} type={TYPES.select} default>
          <FilterField name="campaignType">
            <option value="">{I18n.t('COMMON.ANY')}</option>
            {Object.keys(rewardTypesLabels).map(rewardType => (
              <option key={rewardType} value={rewardType}>
                {renderLabel(rewardType, rewardTypesLabels)}
              </option>
            ))}
          </FilterField>
        </FilterItem>

        <FilterItem label={I18n.t(filterLabels.creationDate)} size={SIZES.big} type={TYPES.range_date}>
          <FilterField
            utc
            name="creationDateFrom"
            isValidDate={this.startDateValidator('creationDateTo')}
            timePresets
            withTime
            closeOnSelect={false}
          />
          <FilterField
            utc
            name="creationDateTo"
            isValidDate={this.endDateValidator('creationDateFrom')}
            timePresets
            withTime
            closeOnSelect={false}
          />
        </FilterItem>

        <FilterItem label={I18n.t(filterLabels.activityDate)} size={SIZES.big} type={TYPES.range_date}>
          <FilterField
            utc
            name="activityDateFrom"
            isValidDate={this.startDateValidator('activityDateTo')}
            timePresets
            withTime
            closeOnSelect={false}
          />
          <FilterField
            utc
            name="activityDateTo"
            isValidDate={this.endDateValidator('activityDateFrom')}
            timePresets
            withTime
            closeOnSelect={false}
          />
        </FilterItem>
      </DynamicFilters>
    );
  }
}

export default connect(state => ({ formValues: getFormValues(FORM_NAME)(state) || {} }))(CampaignGridViewFilter);
