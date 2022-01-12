import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { QueryResult } from 'react-apollo';
import { withRequests } from 'apollo';
import { differenceWith } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikProps } from 'formik';
import { LevelType, Notify } from 'types/notify';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import ShortLoader from 'components/ShortLoader';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import { Security, GroupSecurity } from '../../types';
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
  onSuccess: (security: Security) => void,
  groupSecurities: GroupSecurity[],
}

const validate = createValidator({
  id: 'required',
});

const GroupNewSecurityModal = ({
  isOpen,
  notify,
  onCloseModal,
  onSuccess,
  securitiesQuery,
  groupSecurities,
}: Props) => {
  const { data, loading } = securitiesQuery;
  const securitiesData = data?.tradingEngineSecurities || [];
  const securities = differenceWith(securitiesData, groupSecurities,
    (_security, _groupSecurity) => _security.id === _groupSecurity.security.id);

  const handleSubmit = (security: Security) => {
    onSuccess(security);
    notify({
      level: LevelType.SUCCESS,
      title: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SECURITY_MODAL.TITLE'),
      message: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SECURITY_MODAL.NOTIFICATION.SUCCESS'),
    });
    onCloseModal();
  };

  const handleSecurityChange = (
    value: string,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
  ) => {
    const { id, name } = securities.find(security => security.id === value) || {};

    setFieldValue('id', id);
    setFieldValue('name', name);
  };

  return (
    <Modal
      className="GroupNewSecurityModal"
      toggle={onCloseModal}
      isOpen={isOpen}
    >
      <Formik
        initialValues={{
          id: '',
          name: '',
        }}
        validate={validate}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting, setFieldValue }: FormikProps<Security>) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              <Choose>
                <When condition={loading}>
                  {I18n.t('COMMON.LOADING')}
                </When>
                <Otherwise>
                  {I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SECURITY_MODAL.TITLE')}
                </Otherwise>
              </Choose>
            </ModalHeader>

            <Choose>
              <When condition={loading}>
                <ShortLoader className="GroupNewSecurityModal__loader" />
              </When>
              <Otherwise>
                <ModalBody>
                  <div className="GroupNewSecurityModal__description">
                    {I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SECURITY_MODAL.DESCRIPTION')}
                  </div>

                  <Field
                    name="id"
                    label={I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SECURITY_MODAL.SECURITY')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    component={FormikSelectField}
                    searchable
                    customOnChange={(id: string) => handleSecurityChange(id, setFieldValue)}
                  >
                    {securities.map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
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
              </Otherwise>
            </Choose>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default compose(
  React.memo,
  withNotifications,
  withRequests({
    securitiesQuery: TradingEngineSecuritiesQuery,
  }),
)(GroupNewSecurityModal);
