import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { MultiCurrencyValue } from '../../../../../components/ReduxForm/index';
import PropTypes from '../../../../../constants/propTypes';
import { attributeLabels } from './constants';

class WageringFulfillment extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
  };

  render() {
    const {
      name,
      disabled,
    } = this.props;

    return (
      <div className="row">
        <div className="col-7">
          <MultiCurrencyValue
            label={I18n.t(attributeLabels.amountToWager)}
            baseName={`${name}.amounts`}
            disabled={disabled}
            id="campaign-wagering-select"
          />
        </div>
      </div>
    );
  }
}

export default WageringFulfillment;
