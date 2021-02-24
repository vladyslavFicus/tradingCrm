import React, { PureComponent } from 'react';
import { pick } from 'lodash';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import Select from 'components/Select';
import { Button } from 'components/UI';
import PropTypes from 'constants/propTypes';
import { withStorage } from 'providers/StorageProvider';
import './DynamicFiltersButton.scss';

/**
 * Button to render filters list and save rendered filters to persistent storage to render same list in the future
 * if page will be change or something else while filters will be cleared
 */
class DynamicFiltersButton extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    ...withStorage.propTypes,
    className: PropTypes.string,
    storageKey: PropTypes.string,

    // Filters to show as default if no any filters to render wasn't provided
    defaultFilters: PropTypes.array,

    // Object of filter fields list to render inside select
    filters: PropTypes.object,
  };

  static defaultProps = {
    className: null,
    defaultFilters: [],
    filters: {},
    storageKey: null,
  };

  componentDidUpdate(prevProps) {
    const {
      history,
      location: { state },
      defaultFilters,
      storage,
      storageKey,
    } = this.props;

    // Set default filters fields list if no filters fields list was applied before and the current history operation
    // isn't "replace" state to prevent set default filters list if user cleared select with filters list
    if (!state?.filtersFields?.length && history.action !== 'REPLACE') {
      const storedFilters = storage.get(storageKey) || [];
      const filtersFields = storedFilters.length ? storedFilters : defaultFilters;

      history.replace({
        state: {
          ...state,
          filtersFields,
        },
      });
    }

    // Save to persistent storage if list with filters fields was changed
    if (prevProps.location.state?.filtersFields !== state?.filtersFields && storageKey) {
      storage.set(storageKey, state?.filtersFields);
    }
  }

  /**
   * Handler on change event from select with filter fields list
   * It's also clearing applied filter values if new filters list excluded field with value.
   *
   * @param values
   */
  onChange = (values) => {
    const {
      history,
      location: { state },
    } = this.props;

    history.replace({
      state: {
        ...state,
        filters: pick(state?.filters, values),
        filtersFields: values,
      },
    });
  };

  render() {
    const {
      className,
      filters,
      location: { state },
    } = this.props;

    const value = state?.filtersFields || [];

    return (
      <Select
        multiple
        value={value}
        onRealtimeChange={this.onChange}
        customClassName={className}
        customSelectBlockClassName="DynamicFiltersButton__select-block"
        customSelectBlockContainerClassName="DynamicFiltersButton__select-block-container"
        customArrowComponent={
          <Button primary>{I18n.t('COMMON.BUTTONS.ADD_FILTER')}</Button>
        }
      >
        {Object.keys(filters).map(key => (
          <option key={key} value={key}>{filters[key]}</option>
        ))}
      </Select>
    );
  }
}

export default withRouter(withStorage(DynamicFiltersButton));
