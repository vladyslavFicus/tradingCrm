import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import { MultiCurrencyValue } from '../../../../../components/ReduxForm';
import PropTypes from '../../../../../constants/propTypes';
import Placeholder, { DefaultLoadingPlaceholder } from '../../../../../components/Placeholder';
import { attributeLabels } from '../constants';

class WageringView extends PureComponent {
  static propTypes = {
    uuid: PropTypes.string,
    name: PropTypes.string.isRequired,
    wagering: PropTypes.shape({
      wagering: PropTypes.shape({
        data: PropTypes.shape({
          uuid: PropTypes.string,
          amounts: PropTypes.arrayOf(PropTypes.price),
        }),
      }),
    }),
  };

  static defaultProps = {
    wagering: {},
    uuid: null,
  };

  render() {
    const {
      uuid,
      name,
      wagering,
    } = this.props;

    const data = get(wagering, 'wagering.data', {});
    const loading = get(wagering, 'loading', true);

    return (
      <Choose>
        <When condition={uuid}>
          <Placeholder
            ready={!loading}
            className={null}
            customPlaceholder={<DefaultLoadingPlaceholder />}
          >
            <div className="campaigns-template">
              <If condition={data.amounts}>
                <For each="amount" index="index" of={data.amounts}>
                  <div key={amount.currency} className="row">
                    <div className="col-4">
                      currency
                      <div className="campaigns-template__value">
                        {amount.currency}
                      </div>
                    </div>
                    <div className="col-4">
                      amount
                      <div className="campaigns-template__value">
                        {amount.amount}
                      </div>
                    </div>
                  </div>
                </For>
              </If>
            </div>
          </Placeholder>
        </When>
        <Otherwise>
          <MultiCurrencyValue
            label={I18n.t(attributeLabels.amountToWager)}
            baseName={`${name}.amounts`}
          />
        </Otherwise>
      </Choose>
    );
  }
}

export default WageringView;
