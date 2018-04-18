import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { MultiCurrencyValue } from '../../../../../components/ReduxForm';
import PropTypes from '../../../../../constants/propTypes';
import { attributeLabels } from '../constants';

class WageringView extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    uuid: null,
  };

  render() {
    const {
      name,
      disabled,
    } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-6 form-group">
            <MultiCurrencyValue
              label={I18n.t(attributeLabels.amountToWager)}
              baseName={`${name}.amounts`}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default WageringView;
