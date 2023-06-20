import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { State } from 'types';
import { ResetForm } from 'types/formik';
import { createValidator } from 'utils/validator';
import { decodeNullValues } from 'components/Formik/utils';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Button, RefreshButton } from 'components/Buttons';
import { useDesksAndOfficesListQuery } from './graphql/__generated__/DesksAndOfficesListQuery';
import './TeamsGridFilter.scss';

type FormValues = {
  keyword?: string,
  officeUuid?: string,
  deskUuid?: string,
};

type Props = {
  onRefetch: () => void,
};

const TeamsGridFilter = (props: Props) => {
  const { onRefetch } = props;

  const { state } = useLocation<State<FormValues>>();

  const history = useHistory();

  // ===== Requests ===== //
  const desksAndOfficesQuery = useDesksAndOfficesListQuery({ fetchPolicy: 'network-only' });

  const { data, loading } = desksAndOfficesQuery;
  const officesList = data?.userBranches?.OFFICE || [];
  const desksList = data?.userBranches?.DESK || [];

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
      initialValues={state?.filters || {}}
      onSubmit={handleSubmit}
      validate={createValidator({
        keyword: 'string',
        officeUuid: 'string',
        deskUuid: 'string',
      })}
    >
      {({ values, dirty, isSubmitting, resetForm, setFieldValue }) => {
        const desksByOffice = desksList.filter(desk => desk.parentBranch?.uuid === values.officeUuid);
        const desksOptions = values.officeUuid ? desksByOffice : [];

        if (values.deskUuid && !values.officeUuid) {
          setFieldValue('deskUuid', '');
        }

        return (
          <Form className="TeamsGridFilter__form">
            <div className="TeamsGridFilter__fields">
              <Field
                name="keyword"
                className="TeamsGridFilter__field TeamsGridFilter__search"
                data-testid="TeamsGridFilter-keywordInput"
                label={I18n.t('TEAMS.GRID_FILTERS.SEARCH_BY')}
                placeholder={I18n.t('TEAMS.GRID_FILTERS.SEARCH_BY_PLACEHOLDER')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
                withFocus
              />

              <Field
                name="officeUuid"
                className="TeamsGridFilter__field TeamsGridFilter__select"
                data-testid="TeamsGridFilter-officeUuidSelect"
                label={I18n.t('TEAMS.GRID_FILTERS.OFFICE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                disabled={loading}
                withAnyOption
                searchable
                withFocus
              >
                {officesList.map(({ name, uuid }) => (
                  <option key={uuid} value={uuid}>{name}</option>
                ))}
              </Field>

              <Field
                name="deskUuid"
                className="TeamsGridFilter__field TeamsGridFilter__select"
                data-testid="TeamsGridFilter-deskUuidSelect"
                label={I18n.t('TEAMS.GRID_FILTERS.DESK')}
                placeholder={I18n.t(
                  !desksByOffice.length
                    ? 'TEAMS.GRID_FILTERS.DESK_ERROR_PLACEHOLDER'
                    : 'COMMON.SELECT_OPTION.ANY',
                )}
                component={FormikSelectField}
                disabled={loading || !desksByOffice.length}
                withAnyOption
                searchable
                withFocus
              >
                {desksOptions.map(({ name, uuid }) => (
                  <option key={uuid} value={uuid}>{name}</option>
                ))}
              </Field>
            </div>

            <div className="TeamsGridFilter__buttons">
              <RefreshButton
                className="TeamsGridFilter__button"
                data-testid="TeamsGridFilter-refreshButton"
                onClick={onRefetch}
              />

              <Button
                className="TeamsGridFilter__button"
                data-testid="TeamsGridFilter-resetButton"
                onClick={() => handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="TeamsGridFilter__button"
                data-testid="TeamsGridFilter-applyButton"
                disabled={isSubmitting || !dirty}
                type="submit"
                primary
              >
                {I18n.t('COMMON.APPLY')}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default React.memo(TeamsGridFilter);
