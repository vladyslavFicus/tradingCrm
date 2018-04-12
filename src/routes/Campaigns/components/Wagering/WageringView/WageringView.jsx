import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import PropTypes from '../../../../../constants/propTypes';
import Placeholder from '../../../../../components/Placeholder';

class WageringView extends PureComponent {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    wagering: PropTypes.shape({
      wagering: PropTypes.shape({
        data: PropTypes.shape({
          uuid: PropTypes.string,
          amounts: PropTypes.arrayOf(PropTypes.price),
        }),
      }),
    }).isRequired,
  };

  render() {
    const {
      uuid,
      wagering,
    } = this.props;

    const data = get(wagering, 'wagering.data', {});
    const loading = get(wagering, 'loading', true);

    return (
      <div>
        <If condition={uuid}>
          <Placeholder
            ready={!loading}
            className={null}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '80%', height: '20px' }} />
              </div>
            )}
          >
            <div>
              <If condition={data.amounts}>
                <For each="amount" index="index" of={data.amounts}>
                  <div className="row">
                    <div className="col-4 bonus-template__item">
                      <div className="bonus-template">currency</div>
                      <div>
                        {amount.currency}
                      </div>
                    </div>
                    <div className="col-4 bonus-template__item">
                      <div className="bonus-template">amount</div>
                      <div>
                        {amount.amount}
                      </div>
                    </div>
                  </div>
                </For>
              </If>
            </div>
          </Placeholder>
        </If>
      </div>
    );
  }
}

export default WageringView;
