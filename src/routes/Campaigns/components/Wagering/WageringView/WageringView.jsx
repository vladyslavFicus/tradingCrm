import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { MultiCurrencyValue } from '../../../../../components/ReduxForm';
import PropTypes from '../../../../../constants/propTypes';
import Placeholder from '../../../../../components/Placeholder';
import { attributeLabels } from '../constants';

class WageringView extends PureComponent {
  static propTypes = {
    uuid: PropTypes.string,
    name: PropTypes.string.isRequired,
    optionCurrencies: PropTypes.shape({
      options: PropTypes.shape({
        signUp: PropTypes.shape({
          currency: PropTypes.shape({
            list: PropTypes.arrayOf(PropTypes.string),
            base: PropTypes.PropTypes.string,
          }),
        }),
      }),
    }).isRequired,
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
      optionCurrencies: {
        options,
      },
    } = this.props;

    const data = get(wagering, 'wagering.data', {});
    const loading = get(wagering, 'loading', true);

    const currencies = get(options, 'signUp.post.currency.list', []);
    const baseCurrency = get(options, 'signUp.post.currency.base', '');

    return (
      <div>
        <Choose>
          <When condition={uuid}>
            <Placeholder
              ready={!loading}
              className={null}
              customPlaceholder={(
                <TextRow className="animated-background" style={{ width: '80%', height: '20px' }} />
              )}
            >
              <div>
                <If condition={data.amounts}>
                  <For each="amount" index="index" of={data.amounts}>
                    <div key={amount.currency} className="row">
                      <div className="col-4 bonus-template__item">
                        <div className="bonus-template">currency</div>
                        {amount.currency}
                      </div>
                      <div className="col-4 bonus-template__item">
                        <div className="bonus-template">amount</div>
                        {amount.amount}
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
              baseName={`${name}amounts`}
              baseCurrency={baseCurrency}
              currencies={currencies}
            />
          </Otherwise>
        </Choose>
      </div>
    );
  }
}

export default WageringView;
