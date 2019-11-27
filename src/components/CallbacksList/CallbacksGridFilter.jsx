import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import I18n from 'i18n-js';
import { callbacksStatuses, filterLabels } from '../../constants/callbacks';
import { createValidator } from '../../utils/validator';
import history from '../../router/history';
import createDynamicForm, {
  FilterItem,
  FilterField,
  TYPES,
  SIZES,
} from '../DynamicFilters';

const FORM_NAME = 'callbacksListGridFilter';

const DynamicFilters = createDynamicForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: createValidator({
    searchKeyword: 'string',
    status: 'string',
    registrationDateStart: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    registrationDateEnd: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
  }, filterLabels, false),
});

class CallbacksGridFilter extends Component {
  static propTypes = {
    currentValues: PropTypes.shape({
      searchKeyword: PropTypes.string,
      registrationDateStart: PropTypes.string,
      registrationDateEnd: PropTypes.string,
    }),
    disabled: PropTypes.bool,
    searchKeywordPlaceholder: PropTypes.string,
  };

  static defaultProps = {
    currentValues: {},
    disabled: false,
    searchKeywordPlaceholder: I18n.t(filterLabels.callbackOrPlayerOrOperator),
  };

  onSubmit = (data = {}) => {
    const filters = { ...data };

    if (filters.searchKeyword) {
      switch (true) {
        case (filters.searchKeyword.startsWith('OPERATOR')):
          filters.operatorId = filters.searchKeyword;
          break;

        case (filters.searchKeyword.startsWith('PLAYER')):
          filters.userId = filters.searchKeyword;
          break;

        default:
          filters.id = filters.searchKeyword;
          break;
      }
    }

    if (Array.isArray(filters.statuses)) {
      filters.statuses = filters.statuses.join(',');
    }

    history.replace({ query: { filters } });
  };

  onReset = () => {
    history.replace({ query: { filters: {} } });
  };

  startDateValidator = toAttribute => (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues[toAttribute]
      ? current.isSameOrBefore(moment(currentValues[toAttribute]))
      : true;
  };

  endDateValidator = fromAttribute => (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues[fromAttribute]
      ? current.isSameOrAfter(moment(currentValues[fromAttribute]))
      : true;
  };

  render() {
    const {
      disabled,
      searchKeywordPlaceholder,
    } = this.props;

    return (
      <DynamicFilters
        allowSubmit={disabled}
        allowReset={disabled}
        onSubmit={this.onSubmit}
        onReset={this.onReset}
      >
        <FilterItem label={I18n.t(filterLabels.searchValue)} size={SIZES.big} type={TYPES.input} default>
          <FilterField
            id="users-list-search-field"
            name="searchKeyword"
            placeholder={searchKeywordPlaceholder}
            type="text"
          />
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.status)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          default
        >
          <FilterField name="statuses">
            {Object.keys(callbacksStatuses).map(status => (
              <option key={status} value={status}>
                {I18n.t(callbacksStatuses[status])}
              </option>
            ))}
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.date)}
          size={SIZES.big}
          type={TYPES.range_date}
          placeholder={`${I18n.t('COMMON.DATE_OPTIONS.START_DATE')}/${I18n.t('COMMON.DATE_OPTIONS.END_DATE')}`}
          default
        >
          <FilterField
            name="callbackTimeFrom"
            isValidDate={this.startDateValidator('callbackTimeTo')}
            timePresets
            withTime
            closeOnSelect={false}
          />
          <FilterField
            name="callbackTimeTo"
            isValidDate={this.endDateValidator('callbackTimeFrom')}
            timePresets
            withTime
            closeOnSelect={false}
          />
        </FilterItem>
      </DynamicFilters>
    );
  }
}

export default connect(state => ({
  form: FORM_NAME,
  currentValues: getFormValues(FORM_NAME)(state),
}))(CallbacksGridFilter);
