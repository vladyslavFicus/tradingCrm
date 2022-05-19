import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { differenceWith } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikProps } from 'formik';
import { LevelType, Notify } from 'types/notify';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import ShortLoader from 'components/ShortLoader';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import {
  TradingEngineGroup__GroupSecurity as GroupSecurity,
} from '__generated__/types';
import { Security } from '../../types';
import { useSecuritiesQuery } from './graphql/__generated__/SecuritiesQuery';
import './GroupNewSecurityModal.scss';

interface Props {
  notify: Notify,
  isOpen: boolean,
  onCloseModal: () => void,
  onSuccess: (securities: Security[]) => void,
  groupSecurities: GroupSecurity[],
}

type FormValues = {
  idx: number[]
}

const validate = createValidator({
  idx: 'required',
});

const GroupNewSecurityModal = ({
  isOpen,
  notify,
  onCloseModal,
  onSuccess,
  groupSecurities,
}: Props) => {
  const securitiesQuery = useSecuritiesQuery();
  const { data, loading } = securitiesQuery;
  const securitiesData = data?.tradingEngine.securities || [];
  const securitiesDiff = differenceWith(securitiesData, groupSecurities,
    (_security, _groupSecurity) => _security.id === _groupSecurity.security.id);

  const handleSubmit = ({ idx }: FormValues) => {
    const selectedSecurities = securitiesDiff.filter(security => idx.includes(security.id));

    onSuccess(selectedSecurities);
    notify({
      level: LevelType.SUCCESS,
      title: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SECURITY_MODAL.TITLE'),
      message: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SECURITY_MODAL.NOTIFICATION.SUCCESS'),
    });
    onCloseModal();
  };

  return (
    <Modal
      className="GroupNewSecurityModal"
      toggle={onCloseModal}
      isOpen={isOpen}
    >
      <Formik
        initialValues={{ idx: [] }}
        validate={validate}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting }: FormikProps<FormValues>) => (
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
                    name="idx"
                    label={I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SECURITY_MODAL.SECURITY')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    component={FormikSelectField}
                    searchable
                    multiple
                  >
                    {securitiesDiff.map(({ id, name }) => (
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
)(GroupNewSecurityModal);
