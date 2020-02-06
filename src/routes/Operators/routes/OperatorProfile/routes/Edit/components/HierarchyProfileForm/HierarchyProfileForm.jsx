import React, { Component } from 'react';
import I18n from 'i18n-js';
import { Field } from 'redux-form';
import { omit } from 'lodash';
import PropTypes from 'constants/propTypes';
import { userTypes, userTypeLabels, branchTypes as branchNames } from 'constants/hierarchyTypes';
import ShortLoader from 'components/ShortLoader';
import { NasSelectField } from 'components/ReduxForm';
import AddBranchForm from './AddBranchForm';
import { attributeLabels, fieldNames } from './constants';

import './HierarchyProfileForm.scss';

class HierarchyProfileForm extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    isPartner: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    initialValues: PropTypes.object,
    allowUpdateHierarchy: PropTypes.bool.isRequired,
    branchHierarchy: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      teams: PropTypes.array,
      desks: PropTypes.array,
      offices: PropTypes.array,
      brands: PropTypes.array,
      branchTypes: PropTypes.array,
    }).isRequired,
  };

  static defaultProps = {
    initialValues: {},
  };

  static contextTypes = {
    refetchHierarchy: PropTypes.func.isRequired,
  };

  state = {
    branchFormVisibility: false,
  };

  toggleBranchForm = () => {
    this.setState(({ branchFormVisibility }) => ({
      branchFormVisibility: !branchFormVisibility,
    }));
  };

  handleSubmitUserTypeChange = async ({ [fieldNames.USER_TYPE]: userType }) => {
    const {
      notify,
      updateOperatorHierarchy,
      match: { params: { id } },
    } = this.props;

    const { data: { hierarchy: { updateUser: { error } } } } = await updateOperatorHierarchy({
      variables: {
        operatorId: id,
        userType,
      },
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('OPERATORS.PROFILE.HIERARCHY.ERROR_UPDATE_TYPE'),
      });
    } else {
      const { refetchHierarchy } = this.context;

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('OPERATORS.PROFILE.HIERARCHY.SUCCESS_UPDATE_TYPE'),
      });
      refetchHierarchy();
    }
  };

  handleRemoveBranch = branchId => async () => {
    const {
      notify,
      removeOperatorFromBranch,
      initialValues: { parentBranches },
      match: { params: { id } },
      reset,
    } = this.props;

    const { data: { hierarchy: { removeOperatorFromBranch: { error } } } } = await removeOperatorFromBranch({
      variables: {
        operatorId: id,
        branchId,
      },
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('OPERATORS.PROFILE.HIERARCHY.ERROR_REMOVE_BRANCH'),
      });
    } else {
      const { refetchHierarchy } = this.context;
      const { name } = parentBranches.find(({ uuid }) => uuid === branchId) || { name: '' };

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('OPERATORS.PROFILE.HIERARCHY.SUCCESS_REMOVE_BRANCH', { name }),
      });
      await refetchHierarchy();
      reset();
    }
  };

  hierarchyTree = (type, parentBranch, name, brandId) => {
    const { branchHierarchy } = this.props;
    const parentBranchUuid = parentBranch && parentBranch.uuid;
    let hierarchyTree;

    switch (type) {
      case branchNames.TEAM: {
        const desk = branchHierarchy[branchNames.DESK].find(({ uuid }) => (uuid === parentBranchUuid));

        if (!desk) {
          return null;
        }

        const { name: deskName, parentBranch: { uuid: officeUuid } } = desk;

        const office = branchHierarchy[branchNames.OFFICE].find(({ uuid }) => (uuid === officeUuid));

        if (!office) {
          return null;
        }

        const { name: officeName } = office;

        hierarchyTree = (
          <div className="hierarchy__tree">
            &nbsp;{brandId} &rarr; {officeName} &rarr; {deskName} &rarr;&nbsp;
            <span className="color-info">{name}</span>
          </div>
        );

        break;
      }
      case branchNames.DESK: {
        const office = branchHierarchy[branchNames.OFFICE].find(({ uuid }) => (uuid === parentBranchUuid));

        if (!office) {
          return null;
        }

        const { name: officeName } = office;

        hierarchyTree = (
          <div className="hierarchy__tree">
            &nbsp;{brandId} &rarr; {officeName} &rarr; <span className="color-info">{name}</span>
          </div>
        );

        break;
      }
      case branchNames.OFFICE: {
        hierarchyTree = (
          <div className="hierarchy__tree">
            &nbsp;{brandId} &rarr; <span className="color-info">{name}</span>
          </div>
        );

        break;
      }
      default: {
        hierarchyTree = <div className="hierarchy__tree">&nbsp;{name}</div>;
      }
    }

    return hierarchyTree;
  };

  render() {
    const {
      loading,
      handleSubmit,
      pristine,
      submitting,
      isPartner,
      branchHierarchy,
      allowUpdateHierarchy,
      initialValues: {
        parentBranches,
      },
    } = this.props;

    const { branchFormVisibility } = this.state;

    return (
      <div className="card">
        <div className="card-body">
          <div className="personal-form-heading margin-bottom-20">
            {I18n.t('OPERATORS.PROFILE.HIERARCHY.LABEL')}
          </div>
          <Choose>
            <When condition={loading}>
              <ShortLoader />
            </When>
            <Otherwise>
              <form
                className="row align-items-center"
                onSubmit={handleSubmit(this.handleSubmitUserTypeChange)}
              >
                <Field
                  name={fieldNames.USER_TYPE}
                  label={I18n.t(attributeLabels.userType)}
                  component={NasSelectField}
                  className="col-4"
                  disabled={!allowUpdateHierarchy}
                >
                  {Object
                    .keys(omit(userTypes, [
                      userTypes.CUSTOMER,
                      userTypes.LEAD_CUSTOMER,
                      !isPartner && userTypes.AFFILIATE_PARTNER,
                    ]))
                    .map(value => (
                      <option key={value} value={value}>
                        {I18n.t(userTypeLabels[value])}
                      </option>
                    ))
                  }
                </Field>
                <If condition={!pristine && !submitting && allowUpdateHierarchy}>
                  <div className="col-auto">
                    <button className="btn btn-sm btn-primary" type="submit">
                      {I18n.t('COMMON.SAVE_CHANGES')}
                    </button>
                  </div>
                </If>
              </form>
              <div className="personal-form-heading margin-bottom-10">
                {I18n.t('OPERATORS.PROFILE.HIERARCHY.BRANCHES')}
              </div>
              <Choose>
                <When condition={Array.isArray(parentBranches) && parentBranches.length}>
                  {parentBranches.map(({ uuid, name, branchType, brandId, parentBranch }) => {
                    const hierarchyTree = this.hierarchyTree(branchType, {
                      uuid: parentBranch ? parentBranch.uuid : null,
                    }, name, brandId);

                    return (
                      <If condition={hierarchyTree}>
                        <div key={uuid} className="margin-bottom-10">
                          <strong>
                            {I18n.t(`COMMON.${branchType}`)}: {hierarchyTree}
                          </strong>
                          <If condition={parentBranches.length !== 1 && allowUpdateHierarchy}>
                            <strong className="margin-20">
                              <i
                                id={uuid}
                                onClick={this.handleRemoveBranch(uuid)}
                                className="fa fa-trash cursor-pointer color-danger"
                              />
                            </strong>
                          </If>
                        </div>
                      </If>
                    );
                  })}
                </When>
                <Otherwise>
                  <div className="margin-bottom-10">
                    <strong>{I18n.t('OPERATORS.PROFILE.HIERARCHY.NO_BRANCHES')}</strong>
                  </div>
                </Otherwise>
              </Choose>
              <button
                type="button"
                className="btn btn-sm margin-bottom-10"
                disabled={branchFormVisibility && !allowUpdateHierarchy}
                onClick={this.toggleBranchForm}
              >
                {I18n.t('OPERATORS.PROFILE.HIERARCHY.ADD_BRANCH_LABEL')}
              </button>
              <If condition={branchFormVisibility && allowUpdateHierarchy}>
                <AddBranchForm
                  branchHierarchy={branchHierarchy}
                  hierarchyTree={this.hierarchyTree}
                  hideForm={this.toggleBranchForm}
                  currentBranches={
                    Array.isArray(parentBranches) ? parentBranches.map(({ uuid }) => uuid) : null
                  }
                />
              </If>
            </Otherwise>
          </Choose>
        </div>
      </div>
    );
  }
}

export default HierarchyProfileForm;
