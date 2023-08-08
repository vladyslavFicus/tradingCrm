import React from 'react';
import I18n from 'i18n-js';
import { Input } from 'components';
import './FilterSetsSearch.scss';

type Props = {
  value?: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onReset: () => void,
};

const FilterSetsSearch = (props: Props) => {
  const {
    value = '',
    onChange,
    onReset,
  } = props;

  return (
    <div className="FilterSetsSearch">
      <div className="FilterSetsSearch__field-wrapper">
        <Input
          type="text"
          name="FilterSetsSearch"
          value={value}
          onChange={onChange}
          className="FilterSetsSearch__field"
          placeholder={I18n.t('common.select.default_placeholder')}
          addition={<i className="icon icon-search" />}
        />

        <If condition={!!value}>
          <i
            className="FilterSetsSearch__reset-icon icon icon-times"
            onClick={onReset}
          />
        </If>
      </div>
    </div>
  );
};

export default React.memo(FilterSetsSearch);
