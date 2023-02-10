import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Button } from 'components/Buttons';
import { FilterSetsContext } from '../../FilterSetsDecorator';
import './FilterSetsButtons.scss';

class FilterSetsButtons extends PureComponent {
  render() {
    return (
      <FilterSetsContext.Consumer>
        {({
          visible,
          hasSelectedFilterSet,
          disabled,
          createFilterSet,
          updateFilterSet,
          deleteFilterSet,
        }) => (
          <If condition={visible}>
            <div className={classNames('FilterSetsButtons', { 'FilterSetsButtons--disabled': disabled })}>
              <Button
                secondary
                className="FilterSetsButtons__button"
                onClick={createFilterSet}
              >
                {I18n.t('FILTER_SET.BUTTONS.SAVE')}
              </Button>

              <If condition={hasSelectedFilterSet}>
                <Button
                  secondary
                  className="FilterSetsButtons__button"
                  onClick={updateFilterSet}
                >
                  {I18n.t('FILTER_SET.BUTTONS.SAVE_AS')}
                </Button>

                <Button
                  danger
                  className="FilterSetsButtons__button"
                  onClick={deleteFilterSet}
                >
                  {I18n.t('FILTER_SET.BUTTONS.DELETE')}
                </Button>
              </If>
            </div>
          </If>
        )}
      </FilterSetsContext.Consumer>
    );
  }
}

export default FilterSetsButtons;
