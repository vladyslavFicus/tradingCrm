/* eslint-disable */
import React, {PureComponent} from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n';
import compose from "compose-function";
import { parseErrors, withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import { decodeNullValues } from 'components/Formik/utils';
import { Button } from 'components/UI';
import Symbol from './components/SymbolSettings';
import Calculation from './components/CalculationSettings';
import Swaps from './components/SwapsSettings';
import Sessions from './components/SessionsSettings';
import SymbolsQuery from './graphql/SymbolsQuery';
import './TradingEngineNewSymbol.scss'

interface Props {
  symbolsQuery: {
    data: {
      tradingEngineSymbols: [],
    },
  };
  notify: (value: any) => void,
  createSymbol: (value: any) => void,
}

class TradingEngineNewSymbol extends PureComponent<Props> {
  handleSubmit = async (values: any) => {
    console.log('values---', values);

    const {
      notify,
      createSymbol,
    } = this.props;

    try {
      await createSymbol({
        variables: {
          ...decodeNullValues(values),
        },
      });

      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  render() {
    const {
      symbolsQuery,
    } = this.props;

    const symbols = symbolsQuery.data?.tradingEngineSymbols || [];

    return (
      <div className="TradingEngineNewSymbol">
        <Formik
          enableReinitialize
          initialValues={{
            digits: 4,
            days: 'Wednesday',
          }}
          onSubmit={this.handleSubmit}
        >
          {({
            isSubmitting,
            resetForm,
            values,
            dirty,
          }) => (
            <Form className="TradingEngineNewSymbol__content">
              <div className="TradingEngineNewSymbol__actions">
                <Button
                  type="submit"
                  small
                  primary
                  disabled={!dirty && !isSubmitting}
                >
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </Button>
              </div>

              <div className="TradingEngineNewSymbol__column">
                <Symbol symbols={symbols} />
              </div>

              <hr />

              <div className="TradingEngineNewSymbol__column">
                <Calculation />
              </div>

              <hr />

              <div className="TradingEngineNewSymbol__column">
                <Swaps />
              </div>

              <hr />

              <div className="TradingEngineNewSymbol__column">
                <Sessions />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    symbolsQuery: SymbolsQuery,
  }),
)(TradingEngineNewSymbol);
