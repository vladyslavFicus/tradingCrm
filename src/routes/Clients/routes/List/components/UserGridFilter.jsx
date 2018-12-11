import React, { Component } from 'react';
import moment from 'moment';
import { withApollo, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { isEqual } from 'lodash';
import PropTypes from '../../../../../constants/propTypes';
import { statusesLabels, filterLabels } from '../../../../../constants/user';
import { FilterItem, FilterField, TYPES, SIZES } from '../../../../../components/DynamicFilters';
import { floatNormalize } from '../../../../../utils/inputNormalize';
import I18n from '../../../../../utils/i18n';
import { getBranchChildren } from '../../../../../graphql/queries/hierarchy';
import { salesStatuses } from '../../../../../constants/salesStatuses';
import { retentionStatuses } from '../../../../../constants/retentionStatuses';
import {
  acquisitionStatuses,
  DynamicFilters,
  FORM_NAME,
  fieldNames,
  assignStatuses,
  kycStatuses,
  firstDepositStatuses,
} from './constants';

class UserGridFilter extends Component {
  static propTypes = {
    currentValues: PropTypes.shape({
      keyword: PropTypes.string,
      country: PropTypes.string,
      currency: PropTypes.string,
      ageFrom: PropTypes.string,
      ageTo: PropTypes.string,
      affiliateId: PropTypes.string,
      status: PropTypes.string,
      segments: PropTypes.string,
      registrationDateFrom: PropTypes.string,
      registrationDateTo: PropTypes.string,
      balanceFrom: PropTypes.number,
      balanceTo: PropTypes.number,
    }),
    disabled: PropTypes.bool,
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    countries: PropTypes.object.isRequired,
    teams: PropTypes.arrayOf(PropTypes.hierarchyBranch).isRequired,
    desks: PropTypes.arrayOf(PropTypes.hierarchyBranch).isRequired,
    branchesLoading: PropTypes.bool.isRequired,
    client: PropTypes.object.isRequired,
  };

  static defaultProps = {
    currentValues: {},
    disabled: false,
  };

  state = {
    teams: this.props.teams,
    teamLoading: false,
    isDeskSelected: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.isDeskSelected && !isEqual(nextProps.teams, prevState.teams)) {
      return {
        teams: nextProps.teams,
      };
    }

    return null;
  }

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

  handleFieldChange = async (fieldName, value, formChange) => {
    const { client } = this.props;

    switch (fieldName) {
      case fieldNames.desks: {
        this.setState({ teamLoading: true });
        let teams = null;
        let isDeskSelected = false;

        if (value) {
          const { data: { hierarchy: { branchChildren: { data: deskTeams, error } } } } = await client.query({
            query: getBranchChildren,
            variables: { uuid: value },
          });

          if (!error) {
            teams = deskTeams;
          }
          isDeskSelected = true;
        }

        this.setState(
          {
            ...(teams && { teams }),
            isDeskSelected,
            teamLoading: false,
          },
          value ? null : () => formChange(fieldNames.teams, null),
        );

        break;
      }

      default:
        break;
    }

    formChange(fieldName, value || null);
  }

  render() {
    const {
      onSubmit,
      onReset,
      disabled,
      currencies,
      countries,
      desks,
      branchesLoading,
    } = this.props;

    const {
      teams,
      teamLoading,
    } = this.state;

    return (
      <DynamicFilters
        allowSubmit={disabled}
        allowReset={disabled}
        onSubmit={onSubmit}
        onReset={onReset}
        currencies={currencies}
        countries={countries}
      >
        <FilterItem label={I18n.t(filterLabels.searchValue)} size={SIZES.big} type={TYPES.input} default>
          <FilterField
            id="users-list-search-field"
            name="searchValue"
            placeholder="Name, email, ID..."
            type="text"
          />
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.country)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          default
        >
          <FilterField name="countries" multiple>
            {Object
              .keys(countries)
              .map(key => <option key={key} value={key}>{countries[key]}</option>)
            }
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.desks)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={(!branchesLoading && desks.length === 0)
            ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
            : I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          disabled={branchesLoading}
          onFieldChange={this.handleFieldChange}
          default
        >
          <FilterField name="desks" withAnyOption>
            {desks.map(({ uuid, name }) => (
              <option key={uuid || name} value={uuid}>
                {I18n.t(name)}
              </option>
            ))}
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.teams)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={((!branchesLoading || !teamLoading) && teams.length === 0)
            ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
            : I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          disabled={branchesLoading || teamLoading}
          onFieldChange={this.handleFieldChange}
          default
        >
          <FilterField name="teams" withAnyOption>
            {teams.map(({ uuid, name }) => (
              <option key={uuid || name} value={uuid}>
                {I18n.t(name)}
              </option>
            ))}
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.status)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          default
        >
          <FilterField name="status">
            {Object.keys(statusesLabels).map(status => (
              <option key={status} value={status}>
                {I18n.t(statusesLabels[status])}
              </option>
            ))}
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.acquisitionStatus)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          default
        >
          <FilterField name="acquisitionStatus">
            {acquisitionStatuses.map(item => (
              <option key={item.value} value={item.value}>
                {I18n.t(item.label)}
              </option>
            ))}
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.salesStatus)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          default
        >
          <FilterField name="salesStatuses" multiple>
            {Object
              .keys(salesStatuses)
              .map(key => <option key={key} value={key}>{I18n.t(salesStatuses[key])}</option>)
            }
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.retentionStatus)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          default
        >
          <FilterField name="retentionStatuses" multiple>
            {Object
              .keys(retentionStatuses)
              .map(key => <option key={key} value={key}>{I18n.t(retentionStatuses[key])}</option>)
            }
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.assignStatus)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          default
        >
          <FilterField name="assignStatus" withAnyOption>
            {assignStatuses.map(({ value, label }) => (
              <option key={value} value={value}>
                {I18n.t(label)}
              </option>
            ))}
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.kycStatus)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          default
        >
          <FilterField name="kycStatus">
            {kycStatuses.map(({ value, label }) => (
              <option key={value} value={value}>
                {I18n.t(label)}
              </option>
            ))}
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.firstDeposit)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          default
        >
          <FilterField name="firstDeposit">
            {firstDepositStatuses.map(({ value, label }) => (
              <option key={value} value={value}>
                {I18n.t(label)}
              </option>
            ))}
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.balance)}
          size={SIZES.small}
          type={TYPES.range_input}
          placeholder="0.00/0.00"
          default
        >
          <FilterField
            name="tradingBalanceFrom"
            type="number"
            normalize={floatNormalize}
          />
          <FilterField
            name="tradingBalanceTo"
            type="number"
            normalize={floatNormalize}
          />
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.registrationDate)}
          size={SIZES.big}
          type={TYPES.range_date}
          placeholder={`${I18n.t('COMMON.DATE_OPTIONS.START_DATE')}/${I18n.t('COMMON.DATE_OPTIONS.END_DATE')}`}
          default
        >
          <FilterField
            utc
            name="registrationDateFrom"
            isValidDate={this.startDateValidator('registrationDateTo')}
            timePresets
            withTime
            closeOnSelect={false}
          />
          <FilterField
            utc
            name="registrationDateTo"
            isValidDate={this.endDateValidator('registrationDateFrom')}
            timePresets
            withTime
            closeOnSelect={false}
          />
        </FilterItem>
      </DynamicFilters>
    );
  }
}

export default compose(
  withApollo,
  connect(state => ({
    form: FORM_NAME,
    currentValues: getFormValues(FORM_NAME)(state),
  })),
)(UserGridFilter);
