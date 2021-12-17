import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { QueryResult } from 'react-apollo';
import { withRequests } from 'apollo';
import { omit } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikProps } from 'formik';
import { LevelType, Notify } from 'types/notify';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import {
  Security,
  GroupSecurity,
  GroupCommissionType,
  GroupCommissionLots,
  SpreadDiff,
  LotMin,
  LotMax,
  LotStep,
} from '../../types';
import TradingEngineSecuritiesQuery from './graphql/TradingEngineSecuritiesQuery';
import './GroupNewSecurityModal.scss';

interface SecuritiesData {
  tradingEngineSecurities: Security[],
}

interface Props {
  notify: Notify,
  securitiesQuery: QueryResult<SecuritiesData>,
  isOpen: boolean,
  onCloseModal: () => void,
  onSuccess: (groupSecurity: GroupSecurity) => void,
}

const GroupNewSecurityModal = ({
  isOpen,
  notify,
  onCloseModal,
  onSuccess,
  securitiesQuery,
}: Props) => {
  const securities = securitiesQuery.data?.tradingEngineSecurities || [];

  const handleSubmit = (groupSecurity: GroupSecurity) => {
    onSuccess(groupSecurity);
    notify({
      level: LevelType.SUCCESS,
      title: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SECURITY_MODAL.TITLE'),
      message: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SECURITY_MODAL.NOTIFICATION.SUCCESS'),
    });
    onCloseModal();
  };

  // TODO: fix type any
  const handleSecurityChange = (value: number, setFieldValue: any) => {
    const security = securities.find(({ id }): Security => id === value) || {};
    setFieldValue('security', omit(security, '__typename'));
  };

  return (
    <Modal className="GroupNewSecurityModal" toggle={onCloseModal} isOpen={isOpen} keyboard={false}>
      <Formik
        initialValues={{
          securityId: Date.now(),
          security: {
            id: '',
            name: '',
            description: '',
          },
          show: true,
          spreadDiff: SpreadDiff.SPRED_0,
          lotMin: LotMin.MIN_0_01,
          lotMax: LotMax.MAX_1000_0,
          lotStep: LotStep.STEP_0_01,
          commissionBase: 0,
          commissionType: GroupCommissionType.PIPS,
          commissionLots: GroupCommissionLots.LOT,
        }}
        validate={createValidator({
          security: 'required',
        })}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting, setFieldValue }: FormikProps<Security>) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SECURITY_MODAL.TITLE')}
            </ModalHeader>

            <div className="GroupNewSecurityModal__description">
              {I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SECURITY_MODAL.DESCRIPTION')}
            </div>

            <ModalBody>
              <Field
                name="security"
                label={I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SECURITY_MODAL.SECURITY')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                component={FormikSelectField}
                searchable
                customOnChange={(value: number) => handleSecurityChange(value, setFieldValue)}
              >
                {securities.map(({ id, name, description }) => (
                  <option key={id} value={id}>
                    {`${name}  ${description}`}
                  </option>
                ))}
              </Field>
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={onCloseModal}
                commonOutline
              >
                {I18n.t('COMMON.CANCEL')}
              </Button>
              <Button
                type="submit"
                disabled={!dirty || isSubmitting}
                primary
              >
                {I18n.t('COMMON.SAVE')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default compose(
  withRequests({
    securitiesQuery: TradingEngineSecuritiesQuery,
  }),
  withNotifications,
)(React.memo(GroupNewSecurityModal));
