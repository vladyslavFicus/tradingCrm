import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Button } from 'components/UI';
import './FilterSetsButtons.scss';

class FilterSetsButtons extends PureComponent {
  static propTypes = {
    hasSelectedFilter: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    createFilter: PropTypes.func.isRequired,
    updateFilter: PropTypes.func.isRequired,
    deleteFilter: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  render() {
    const {
      hasSelectedFilter,
      disabled,
      createFilter,
      updateFilter,
      deleteFilter,
    } = this.props;

    return (
      <div className={classNames('FilterSetsButtons', { 'FilterSetsButtons--disabled': disabled })}>
        <Button
          className="FilterSetsButtons__button FilterSetsButtons__button--primary"
          onClick={createFilter}
        >
          {
            hasSelectedFilter
              ? I18n.t('FILTER_SET.BUTTONS.SAVE_AS')
              : I18n.t('FILTER_SET.BUTTONS.SAVE')
          }
        </Button>

        <If condition={hasSelectedFilter}>
          <Button
            className="FilterSetsButtons__button FilterSetsButtons__button--primary"
            onClick={updateFilter}
          >
            {I18n.t('FILTER_SET.BUTTONS.SAVE')}
          </Button>

          <Button
            className="FilterSetsButtons__button FilterSetsButtons__button--danger"
            onClick={deleteFilter}
          >
            {I18n.t('FILTER_SET.BUTTONS.DELETE')}
          </Button>
        </If>
      </div>
    );
  }
}

export default FilterSetsButtons;
