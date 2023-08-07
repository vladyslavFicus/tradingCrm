import React from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { Button, RefreshButton } from 'components';
import { createValidator } from 'utils/validator';
import useFilter from 'hooks/useFilter';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import useTeamsGridFilter from 'routes/Teams/hooks/useTeamsGridFilter';
import { FormValues } from 'routes/Teams/types/teamsGridFilter';
import './TeamsGridFilter.scss';

type Props = {
  onRefetch: () => void,
};

const TeamsGridFilter = (props: Props) => {
  const { onRefetch } = props;

  // ===== Hooks ===== //
  const { loading, officesList, desksList } = useTeamsGridFilter();

  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <Formik
      enableReinitialize
      initialValues={filters}
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
