import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Button } from 'components/UI';
import './FilterSetsButtons.scss';

class FilterSetsButtons extends PureComponent {
  static propTypes = {
    hasSelectedFilterSet: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    createFilterSet: PropTypes.func.isRequired,
    updateFilterSet: PropTypes.func.isRequired,
    deleteFilterSet: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  render() {
    const {
      hasSelectedFilterSet,
      disabled,
      createFilterSet,
      updateFilterSet,
      deleteFilterSet,
    } = this.props;

    return (
      <div className={classNames('FilterSetsButtons', { 'FilterSetsButtons--disabled': disabled })}>
        <Button
          className="FilterSetsButtons__button FilterSetsButtons__button--primary"
          onClick={createFilterSet}
        >
          {I18n.t('FILTER_SET.BUTTONS.SAVE')}
        </Button>

        <If condition={hasSelectedFilterSet}>
          <Button
            className="FilterSetsButtons__button FilterSetsButtons__button--primary"
            onClick={updateFilterSet}
          >
            {I18n.t('FILTER_SET.BUTTONS.SAVE_AS')}
          </Button>

          <Button
            className="FilterSetsButtons__button FilterSetsButtons__button--danger"
            onClick={deleteFilterSet}
          >
            {I18n.t('FILTER_SET.BUTTONS.DELETE')}
          </Button>
        </If>
      </div>
    );
  }
}

export default FilterSetsButtons;
