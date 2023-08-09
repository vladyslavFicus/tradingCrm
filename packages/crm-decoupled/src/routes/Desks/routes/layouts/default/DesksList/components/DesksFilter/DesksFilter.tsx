import React from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { Utils } from '@crm/common';
import { Button, RefreshButton } from 'components';
import useFilter from 'hooks/useFilter';
import { Desk__Types__Enum as DeskTypesEnum, HierarchyBranch } from '__generated__/types';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import useDesks from 'routes/Desks/routes/hooks/useDesks';
import useDesksFilter from 'routes/Desks/routes/hooks/useDesksFilter';
import { FormValues } from 'routes/Desks/types';
import './DesksFilter.scss';

const DesksFilter = () => {
  const { refetch } = useDesks();

  // ===== Hooks ===== //
  const { officesList } = useDesksFilter();

  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <Formik
      enableReinitialize
      className="DesksFilter"
      initialValues={filters}
      validate={Utils.createValidator({
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
        <Form className="DesksFilter__form">
          <div className="DesksFilter__fields">
            <Field
              name="keyword"
              className="DesksFilter__field DesksFilter__search"
              data-testid="DesksFilter-keywordInput"
              label={I18n.t('DESKS.GRID_FILTERS.SEARCH_BY')}
              placeholder={I18n.t('DESKS.GRID_FILTERS.SEARCH_BY_PLACEHOLDER')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              withFocus
            />

            <Field
              name="officeUuid"
              className="DesksFilter__field DesksFilter__select"
              data-testid="DesksFilter-officeUuidSelect"
              label={I18n.t('DESKS.GRID_FILTERS.OFFICE')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              component={FormikSelectField}
              withAnyOption
              searchable
              withFocus
            >
              {officesList.map(({ name, uuid }: HierarchyBranch) => (
                <option key={uuid} value={uuid}>{name}</option>
              ))}
            </Field>

            <Field
              name="deskType"
              className="DesksFilter__field DesksFilter__select"
              data-testid="DesksFilter-deskTypeSelect"
              label={I18n.t('DESKS.GRID_FILTERS.DESK_TYPE')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              component={FormikSelectField}
              withAnyOption
              withFocus
            >
              {Utils.enumToArray(DeskTypesEnum).map(deskType => (
                <option key={deskType} value={deskType}>
                  {I18n.t(`DESKS.GRID_FILTERS.DESK_TYPE_OPTIONS.${deskType}`)}
                </option>
              ))}
            </Field>
          </div>

          <div className="DesksFilter__buttons">
            <RefreshButton
              className="DesksFilter__button"
              data-testid="DesksFilter-refreshButton"
              onClick={refetch}
            />

            <Button
              className="DesksFilter__button"
              data-testid="DesksFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="DesksFilter__button"
              data-testid="DesksFilter-applyButton"
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

export default React.memo(DesksFilter);
