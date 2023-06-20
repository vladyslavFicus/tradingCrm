import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { State } from 'types';
import { Desk__Types__Enum as DeskTypesEnum } from '__generated__/types';
import { ResetForm } from 'types/formik';
import enumToArray from 'utils/enumToArray';
import { createValidator } from 'utils/validator';
import { decodeNullValues } from 'components/Formik/utils';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Button, RefreshButton } from 'components/Buttons';
import { useOfficesListQuery } from './graphql/__generated__/OfficesListQuery';
import './DesksGridFilter.scss';

type FormValues = {
  keyword?: string,
  officeUuid?: string,
  deskType?: string,
};

type Props = {
  onRefetch: () => void,
};

const DesksGridFilter = (props: Props) => {
  const { onRefetch } = props;

  const { state } = useLocation<State<FormValues>>();

  const history = useHistory();

  // ===== Requests ===== //
  const officesListQuery = useOfficesListQuery({ fetchPolicy: 'network-only' });

  const officesList = officesListQuery.data?.userBranches?.OFFICE || [];

  // ===== Handlers ===== //
  const handleSubmit = (values: FormValues) => {
    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  const handleReset = (resetForm: ResetForm<FormValues>) => {
    history.replace({
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm();
  };

  return (
    <Formik
      enableReinitialize
      className="DesksGridFilter"
      initialValues={state?.filters || {}}
      validate={createValidator({
        keyword: 'string',
        officeUuid: 'string',
        deskType: 'string',
      })}
      onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="DesksGridFilter__form">
          <div className="DesksGridFilter__fields">
            <Field
              name="keyword"
              className="DesksGridFilter__field DesksGridFilter__search"
              data-testid="DesksGridFilter-keywordInput"
              label={I18n.t('DESKS.GRID_FILTERS.SEARCH_BY')}
              placeholder={I18n.t('DESKS.GRID_FILTERS.SEARCH_BY_PLACEHOLDER')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              withFocus
            />

            <Field
              name="officeUuid"
              className="DesksGridFilter__field DesksGridFilter__select"
              data-testid="DesksGridFilter-officeUuidSelect"
              label={I18n.t('DESKS.GRID_FILTERS.OFFICE')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              component={FormikSelectField}
              withAnyOption
              searchable
              withFocus
            >
              {officesList.map(({ name, uuid }) => (
                <option key={uuid} value={uuid}>{name}</option>
              ))}
            </Field>

            <Field
              name="deskType"
              className="DesksGridFilter__field DesksGridFilter__select"
              data-testid="DesksGridFilter-deskTypeSelect"
              label={I18n.t('DESKS.GRID_FILTERS.DESK_TYPE')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              component={FormikSelectField}
              withAnyOption
              withFocus
            >
              {enumToArray(DeskTypesEnum).map(deskType => (
                <option key={deskType} value={deskType}>
                  {I18n.t(`DESKS.GRID_FILTERS.DESK_TYPE_OPTIONS.${deskType}`)}
                </option>
              ))}
            </Field>
          </div>

          <div className="DesksGridFilter__buttons">
            <RefreshButton
              className="DesksGridFilter__button"
              data-testid="DesksGridFilter-refreshButton"
              onClick={onRefetch}
            />

            <Button
              className="DesksGridFilter__button"
              data-testid="DesksGridFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="DesksGridFilter__button"
              data-testid="DesksGridFilter-applyButton"
              disabled={isSubmitting || !dirty}
              type="submit"
              primary
            >
              {I18n.t('COMMON.APPLY')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(DesksGridFilter);
