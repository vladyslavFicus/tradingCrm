import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import { omit } from 'lodash';
import PropTypes from 'constants/propTypes';
import { userTypes, userTypeLabels, branchTypes as branchNames } from 'constants/hierarchyTypes';
import ShortLoader from 'components/ShortLoader';
import { NasSelectField } from 'components/ReduxForm';
import AddBranchForm from './AddBranchForm';
import { attributeLabels, fieldNames } from './constants';

class HierarchyProfileForm extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    isPartner: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    initialValues: PropTypes.object,
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
  }

  static contextTypes = {
    refetchHierarchy: PropTypes.func.isRequired,
  };

  state = {
    branchFormVisibility: false,
  };

  toggleBranchForm = () => {
    this.setState({
      branchFormVisibility: !this.state.branchFormVisibility,
    });
  }

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
  }

  hierarchyTree = (type, parentBranch, name, brandId) => {
    const { branchHierarchy } = this.props;
    const NOT_FOUND = 'Not Found';
    const parentBranchUuid = parentBranch && parentBranch.uuid;
    let hierarchyTree;

    switch (type) {
      case (branchNames.TEAM): {
        const desk = branchHierarchy[branchNames.DESK].find(({ uuid }) => (uuid === parentBranchUuid));
        const { name: deskName, parentBranch: { uuid: officeUuid } } = desk || {};

        const office = branchHierarchy[branchNames.OFFICE].find(({ uuid }) => (uuid === officeUuid));
        const { name: officeName } = office || {};

        hierarchyTree = (
          <div>&nbsp;{brandId} &rarr; {officeName || NOT_FOUND} &rarr; {deskName || NOT_FOUND} &rarr;&nbsp;
            <span className="color-info">{name}</span>
          </div>
        );

        break;
      }
      case (branchNames.DESK): {
        const office = branchHierarchy[branchNames.OFFICE].find(({ uuid }) => (uuid === parentBranchUuid));
        const { name: officeName } = office || {};

        hierarchyTree = (
          <div>&nbsp;{brandId} &rarr; {officeName || NOT_FOUND} &rarr; <span className="color-info">{name}</span></div>
        );

        break;
      }
      case (branchNames.OFFICE): {
        hierarchyTree = <div>&nbsp;{brandId} &rarr; <span className="color-info">{name}</span></div>;

        break;
      }
      default: {
        hierarchyTree = <div>&nbsp;{name}</div>;
      }
    }

    return hierarchyTree;
  }

  render() {
    const {
      loading,
      handleSubmit,
      pristine,
      submitting,
      isPartner,
      branchHierarchy,
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
                >
                  {Object
                    .keys(omit(userTypes, [userTypes.CUSTOMER, userTypes.LEAD_CUSTOMER, !isPartner && userTypes.AFFILIATE_PARTNER]))
                    .map(value => (
                      <option key={value} value={value}>
                        {I18n.t(userTypeLabels[value])}
                      </option>
                    ))
                  }
                </Field>
                <If condition={!pristine && !submitting}>
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
                  {parentBranches.map(({ uuid, name, branchType, brandId, parentBranch }) => (
                    <div key={uuid} className="margin-bottom-10">
                      <strong>
                        {I18n.t(`COMMON.${branchType}`)}: {name}
                      </strong>
                      <If condition={parentBranches.length !== 1}>
                        <strong className="margin-20">
                          <i
                            id={uuid}
                            onClick={this.handleRemoveBranch(uuid)}
                            className="fa fa-trash cursor-pointer color-danger"
                          />
                        </strong>
                      </If>
                      <strong className="d-inline-block">
                        {this.hierarchyTree(branchType, {
                          uuid: parentBranch ? parentBranch.uuid : null,
                        }, name, brandId)}
                      </strong>
                    </div>
                  )) }
                </When>
                <Otherwise>
                  <div className="margin-bottom-10">
                    <strong>{I18n.t('OPERATORS.PROFILE.HIERARCHY.NO_BRANCHES')}</strong>
                  </div>
                </Otherwise>
              </Choose>
              <button
                className="btn btn-sm margin-bottom-10"
                disabled={branchFormVisibility}
                onClick={this.toggleBranchForm}
              >
                {I18n.t('OPERATORS.PROFILE.HIERARCHY.ADD_BRANCH_LABEL')}
              </button>
              <If condition={branchFormVisibility}>
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
