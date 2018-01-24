import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { SelectField } from '../../../../../../../components/ReduxForm';
import PropTypes from '../../../../../../../constants/propTypes';
import { createValidator, translateLabels } from '../../../../../../../utils/validator';
import { attributeLabels } from './constants';
import { departmentsLabels, rolesLabels } from '../../../../../../../constants/operators';
import renderLabel from '../../../../../../../utils/renderLabel';

class DepartmentsForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool.isRequired,
    onFetch: PropTypes.func.isRequired,
    roles: PropTypes.arrayOf(PropTypes.dropDownOption),
    departments: PropTypes.arrayOf(PropTypes.dropDownOption),
    authorities: PropTypes.arrayOf(PropTypes.authorityEntity),
  };
  static defaultProps = {
    handleSubmit: null,
    submitting: false,
    roles: [],
    departments: [],
    authorities: [],
  };

  state = {
    show: false,
  };

  toggleShow = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  handleSubmitAndHide = async (params) => {
    const action = await this.props.onSubmit(params);

    if (action && !action.error) {
      this.toggleShow();
    }
  };

  render() {
    const {
      handleSubmit,
      submitting,
      invalid,
      roles,
      authorities,
      departments: configDepartments,
    } = this.props;

    const operatorDepartments = authorities.map(item => item.department);
    const availableDepartments = configDepartments
      .filter(item => operatorDepartments.indexOf(item.value) === -1);

    return (
      <div>
        {
          !this.state.show && !!availableDepartments.length &&
          <button className="btn btn-sm" onClick={this.toggleShow}>
            {I18n.t('OPERATORS.PROFILE.DEPARTMENTS.ADD_BUTTON_LABEL')}
          </button>
        }

        {
          this.state.show &&
            <form onSubmit={handleSubmit(this.handleSubmitAndHide)}>
              <div className="filter-row">
                <div className="filter-row__medium">
                  <Field
                    name="department"
                    label={I18n.t(attributeLabels.department)}
                    type="text"
                    component={SelectField}
                    position="vertical"
                  >
                    <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
                    {
                      availableDepartments.map(({ label, value }) => (
                        <option key={value} value={value}>
                          {renderLabel(label, departmentsLabels)}
                        </option>
                      ))
                    }
                  </Field>
                </div>
                <div className="filter-row__medium">
                  <Field
                    name="role"
                    label={I18n.t(attributeLabels.role)}
                    type="text"
                    component={SelectField}
                    position="vertical"
                  >
                    <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
                    {
                      roles.map(({ label, value }) => (
                        <option key={value} value={value}>
                          {renderLabel(label, rolesLabels)}
                        </option>
                      ))
                    }
                  </Field>
                </div>
                <div className="filter-row__button-block">
                  <div className="button-block-container">
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
                      type="reset"
                    >
                      {I18n.t('COMMON.CANCEL')}
                    </button>
                  </div>
                </div>
              </div>
            </form>
        }
      </div>
    );
  }
}

export default reduxForm({
  form: 'operatorDepartmentsEdit',
  validate: (values, props) => {
    const { authorities, departments: configDepartments, roles } = props;
    const operatorDepartments = authorities.map(item => item.department);

    const availableDepartments = configDepartments
      .filter(item => operatorDepartments.indexOf(item.value) === -1)
      .map(item => item.value);

    return createValidator({
      department: ['required', `in:,${availableDepartments.join()}`],
      role: ['required', `in:,${roles.map(item => item.value).join()}`],
    },
    translateLabels(attributeLabels),
    false
    )(values);
  },
})(DepartmentsForm);
