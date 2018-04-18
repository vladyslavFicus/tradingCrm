import React, { PureComponent } from 'react';
import { get, set } from 'lodash';
import { I18n } from 'react-redux-i18n';
import { MultiCurrencyValue } from '../../../../../components/ReduxForm';
import PropTypes from '../../../../../constants/propTypes';
import Placeholder, { DefaultLoadingPlaceholder } from '../../../../../components/Placeholder';
import { attributeLabels } from '../constants';
import deepRemoveKeyByRegex from '../../../../../utils/deepKeyPrefixRemove';

class WageringView extends PureComponent {
  static propTypes = {
    uuid: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    wagering: PropTypes.shape({
      wagering: PropTypes.shape({
        data: PropTypes.shape({
          uuid: PropTypes.string,
          amounts: PropTypes.arrayOf(PropTypes.price),
        }),
      }),
    }),
    formValues: PropTypes.object.isRequired,
  };

  static contextTypes = {
    _reduxForm: PropTypes.shape({
      initialize: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    wagering: {},
    uuid: null,
  };

  componentWillReceiveProps({ wagering: nextWagering }) {
    const { uuid, name, type, wagering, formValues } = this.props;

    const loading = get(wagering, 'loading', true);
    const nextLoading = get(nextWagering, 'loading', true);

    if (uuid && loading && !nextLoading) {
      const data = get(nextWagering, 'wagering.data', null);

      if (data) {
        const { _reduxForm: { initialize } } = this.context;
        const initialValue = set({ ...formValues }, name, { ...deepRemoveKeyByRegex(data, /^__/), type });

        initialize(initialValue, true, { keepDirty: true });
      }
    }
  }

  render() {
    const {
      uuid,
      name,
      wagering,
    } = this.props;

    const loading = get(wagering, 'loading', true);

    return (
      <Placeholder
        ready={!uuid || !loading}
        className={null}
        customPlaceholder={<DefaultLoadingPlaceholder />}
      >
        <div>
          <div className="row">
            <div className="col-6 form-group">
              <MultiCurrencyValue
                label={I18n.t(attributeLabels.amountToWager)}
                baseName={`${name}.amounts`}
              />
            </div>
          </div>
        </div>
      </Placeholder>
    );
  }
}

export default WageringView;
