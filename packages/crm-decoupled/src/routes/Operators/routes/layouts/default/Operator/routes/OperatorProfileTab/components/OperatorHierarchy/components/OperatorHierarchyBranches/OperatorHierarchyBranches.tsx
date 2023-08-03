import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Operator } from '__generated__/types';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { createValidator, translateLabels } from 'utils/validator';
import useOperatorHierarchyBranches from 'routes/Operators/routes/hooks/useOperatorHierarchyBranches';
import './OperatorHierarchyBranches.scss';

const attributeLabels = {
  brandId: 'COMMON.BRAND',
  branchType: 'COMMON.BRANCH_TYPE',
  branch: 'COMMON.BRANCH',
};

type Props = {
  operator: Operator,
  allowToUpdateHierarchy: boolean,
};

const OperatorHierarchyBranches = (props: Props) => {
  const { allowToUpdateHierarchy, operator } = props;

  const {
    operatorBranches,
    buildOperatorParentsBranchChain,
    isVisibleAddBranchForm,
    brandsLoading,
    hierarchyLoading,
    operatorBranchesUuids,
    brandsList,
    branchTypesOptions,
    buildHierarchyParentsBranchChain,
    toggleAddBranchFormVisibility,
    getBranchTypeList,
    handleSubmit,
    handleRemoveBranch,
    handleBranchTypeChange,
    handleBrandChange,
  } = useOperatorHierarchyBranches({ operator });

  return (
    <div className="OperatorHierarchyBranches">
      {/* Branches list */}
      <div className="OperatorHierarchyBranches__branches">
        <Choose>
          <When condition={!!operatorBranches.length}>
            {operatorBranches.map(branchItem => (
              <div className="OperatorHierarchyBranches__branch" key={branchItem.uuid}>
                <div className="OperatorHierarchyBranches__branch-title">
                  {`${I18n.t(`COMMON.${branchItem.branchType}`)}: ${buildOperatorParentsBranchChain(branchItem)}`}

                  <span className="OperatorHierarchyBranches__branch-name">{branchItem.name}</span>
                </div>

                <If condition={operatorBranches.length > 1 && allowToUpdateHierarchy}>
                  <i
                    onClick={() => handleRemoveBranch(branchItem)}
                    className="fa fa-trash OperatorHierarchyBranches__branch-remove"
                  />
                </If>
              </div>
            ))}
          </When>

          <Otherwise>
            <div className="OperatorHierarchyBranches__no-branches">
              {I18n.t('OPERATORS.PROFILE.HIERARCHY.NO_BRANCHES')}
            </div>
          </Otherwise>
        </Choose>
      </div>

      {/* Open form action button && Add branch form */}
      <If condition={allowToUpdateHierarchy}>
        <Choose>
          <When condition={!isVisibleAddBranchForm}>
            <Button
              small
              tertiary
              className="OperatorHierarchyBranches__add-button"
              data-testid="OperatorHierarchyBranches-addBranchButton"
              onClick={toggleAddBranchFormVisibility}
            >
              {I18n.t('OPERATORS.PROFILE.HIERARCHY.ADD_BRANCH_LABEL')}
            </Button>
          </When>

          <Otherwise>
            <hr />

            <Formik
              initialValues={{ brandId: '', branchType: '', branchUuid: '' }}
              validate={
                createValidator({
                  brandId: ['required'],
                  branchType: ['required'],
                  branchUuid: [
                    'required_if:branchType,OFFICE',
                    'required_if:branchType,DESK',
                    'required_if:branchType,TEAM',
                  ],
                }, translateLabels(attributeLabels))
              }
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values, setFieldValue }) => {
                const branches = getBranchTypeList(values.branchType);
                const availableBranches = branches.filter(({ uuid }) => !operatorBranchesUuids.includes(uuid));
                const disabledBranchUuid = !availableBranches.length
                  || !values.branchType
                  || values.branchType === 'BRAND'
                  || hierarchyLoading;

                return (
                  <Form className="OperatorHierarchyBranches__form">
                    <Field
                      name="brandId"
                      className="OperatorHierarchyBranches__form-field"
                      data-testid="OperatorHierarchyBranches-brandIdSelect"
                      label={I18n.t(attributeLabels.brandId)}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                      customOnChange={(value: string) => handleBrandChange(value, setFieldValue)}
                      component={FormikSelectField}
                      disabled={isSubmitting || brandsLoading}
                      searchable
                    >
                      {brandsList.map(brand => (
                        <option key={brand.uuid} value={brand.uuid}>
                          {brand.name}
                        </option>
                      ))}
                    </Field>

                    <Field
                      name="branchType"
                      className="OperatorHierarchyBranches__form-field"
                      data-testid="OperatorHierarchyBranches-branchTypeSelect"
                      label={I18n.t(attributeLabels.branchType)}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                      customOnChange={(value: string) => handleBranchTypeChange(value, setFieldValue)}
                      component={FormikSelectField}
                      disabled={isSubmitting || !values.brandId}
                      searchable
                    >
                      {branchTypesOptions.map(branchType => (
                        <option key={branchType} value={branchType}>
                          {I18n.t(`COMMON.${branchType}`)}
                        </option>
                      ))}
                    </Field>

                    <Field
                      name="branchUuid"
                      label={I18n.t(attributeLabels.branch)}
                      className="OperatorHierarchyBranches__form-field"
                      data-testid="OperatorHierarchyBranches-branchUuidSelect"
                      component={FormikSelectField}
                      placeholder={I18n.t(
                        !availableBranches.length
                          ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                          : 'COMMON.SELECT_OPTION.DEFAULT',
                      )}
                      disabled={disabledBranchUuid}
                      searchable
                    >
                      {availableBranches.map(branch => (
                        // @ts-ignore prop "search" does not exist for the tag option
                        <option key={branch.uuid} value={branch.uuid} search={branch.name}>
                          {buildHierarchyParentsBranchChain(branch)}
                          <span className="OperatorHierarchyBranches__branch-name">{branch.name}</span>
                        </option>
                      ))}
                    </Field>

                    <div className="OperatorHierarchyBranches__form-buttons">
                      <Button
                        primary
                        className="OperatorHierarchyBranches__form-button"
                        data-testid="OperatorHierarchyBranches-saveButton"
                        disabled={isSubmitting}
                        type="submit"
                      >
                        {I18n.t('COMMON.SAVE')}
                      </Button>

                      <Button
                        secondary
                        className="OperatorHierarchyBranches__form-button"
                        data-testid="OperatorHierarchyBranches-cancelButton"
                        onClick={toggleAddBranchFormVisibility}
                      >
                        {I18n.t('COMMON.CANCEL')}
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </Otherwise>
        </Choose>
      </If>
    </div>
  );
};

export default React.memo(OperatorHierarchyBranches);
