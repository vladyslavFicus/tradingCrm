import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { compose } from 'redux';
import { SelectField } from '../../../../../../../components/ReduxForm';
import PropTypes from '../../../../../../../constants/propTypes';
import { createValidator, translateLabels } from '../../../../../../../utils/validator';
import { attributeLabels } from './constants';
import { departmentsLabels, rolesLabels } from '../../../../../../../constants/operators';
import renderLabel from '../../../../../../../utils/renderLabel';
import shallowEqual from '../../../../../../../utils/shallowEqual';
import { withReduxFormValues } from '../../../../../../../components/HighOrder';

class DepartmentsForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    change: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool.isRequired,
    departmentsRoles: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    authorities: PropTypes.arrayOf(PropTypes.authorityEntity),
    formValues: PropTypes.shape({
      department: PropTypes.string,
      role: PropTypes.string,
    }),
  };

  static defaultProps = {
    handleSubmit: null,
    change: null,
    submitting: false,
    authorities: [],
    formValues: {},
  };

  state = {
    show: false,
  };

  componentWillReceiveProps({ formValues: nextFormValues }) {
    const { formValues, change, departmentsRoles } = this.props;

    if (!shallowEqual(formValues, nextFormValues)) {
      if (formValues.department !== nextFormValues.department && nextFormValues.department) {
        const roles = departmentsRoles[nextFormValues.department];

        if (roles.length === 1) {
          change('role', roles[0]);
        }
      }
    }
  }

  toggleShow = () => {
    this.setState(({ show }) => ({
      show: !show,
    }));
  };

  handleSubmitAndHide = async (params) => {
    const { reset, onSubmit } = this.props;
    const action = await onSubmit(params);

    if (action && !action.error) {
      this.toggleShow();
      reset();
    }
  };

  render() {
    const {
      handleSubmit,
      submitting,
      invalid,
      departmentsRoles,
      authorities,
      formValues,
    } = this.props;

    const operatorDepartments = authorities.map(item => item.department);
    const availableDepartments = Object.keys(departmentsRoles)
      .filter(item => operatorDepartments.indexOf(item) === -1);
    const availableRoles = formValues.department ? departmentsRoles[formValues.department] : [];

    return (
      <div>
        <If condition={!this.state.show && !!availableDepartments.length}>
          <button type="button" className="btn btn-sm" onClick={this.toggleShow}>
            {I18n.t('OPERATORS.PROFILE.DEPARTMENTS.ADD_BUTTON_LABEL')}
          </button>
        </If>

        <If condition={this.state.show}>
          <form className="filter-row" onSubmit={handleSubmit(this.handleSubmitAndHide)}>
            <Field
              name="department"
              label={I18n.t(attributeLabels.department)}
              type="text"
              component={SelectField}
              className="filter-row__medium"
            >
              <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
              {
                availableDepartments.map(item => (
                  <option key={item} value={item}>
                    {renderLabel(item, departmentsLabels)}
                  </option>
                ))
              }
            </Field>
            <Field
              name="role"
              label={I18n.t(attributeLabels.role)}
              type="text"
              component={SelectField}
              className="filter-row__medium"
            >
              <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
              {availableRoles.map(item => (
                <option key={item} value={item}>
                  {renderLabel(item, rolesLabels)}
                </option>
              ))}
            </Field>
            <div className="filter-row__button-block">
              <button
                disabled={submitting || invalid}
                className="btn btn-primary"
                type="submit"
              >
                {I18n.t('COMMON.SAVE')}
              </button>
              <button
                onClick={this.toggleShow}
                className="btn btn-default"
                type="button"
              >
                {I18n.t('COMMON.CANCEL')}
              </button>
            </div>
          </form>
        </If>
      </div>
    );
  }
}

export default compose(
  reduxForm({
    form: 'operatorDepartmentsEdit',
    validate: (values, props) => {
      const { authorities, departmentsRoles } = props;
      const operatorDepartments = authorities.map(item => item.department);

      const availableDepartments = Object.keys(departmentsRoles)
        .filter(item => operatorDepartments.indexOf(item) === -1)
        .map(item => item);

      const rules = {
        department: ['required', `in:,${availableDepartments.join()}`],
        role: ['required'],
      };

      if (values.department && departmentsRoles[values.department]) {
        rules.role.push(`in:,${departmentsRoles[values.department].join()}`);
      }

      return createValidator(rules, translateLabels(attributeLabels), false)(values);
    },
  }),
  withReduxFormValues,
)(DepartmentsForm);
