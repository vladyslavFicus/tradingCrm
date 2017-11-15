import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { SelectField } from '../../../../../../../components/ReduxForm';
import PropTypes from '../../../../../../../constants/propTypes';
import { createValidator } from '../../../../../../../utils/validator';
import { departmentsLabels, rolesLabels } from '../../../../../../../constants/operators';
import renderLabel from '../../../../../../../utils/renderLabel';

const attributeLabels = {
  department: 'Department',
  role: 'Role',
};

const validator = (values, props) => {
  const { authorities, departments: configDepartments, roles } = props;
  const operatorDepartments = authorities.map(item => item.department);

  const availableDepartments = configDepartments
    .filter(item => operatorDepartments.indexOf(item.value) === -1)
    .map(item => item.value);

  return createValidator({
    department: ['required', `in:,${availableDepartments.join()}`],
    role: ['required', `in:,${roles.map(item => item.value).join()}`],
  },
    attributeLabels,
    false
  )(values);
};

class DepartmentsForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    onFetch: PropTypes.func.isRequired,
    roles: PropTypes.arrayOf(PropTypes.dropDownOption),
    departments: PropTypes.arrayOf(PropTypes.dropDownOption),
    authorities: PropTypes.arrayOf(PropTypes.authorityEntity),
  };

  state = {
    show: false,
  };

  componentDidMount() {
    this.props.onFetch();
  }

  toggleShow = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  handleSubmitAndHide = (params) => {
    this.props.onSubmit(params).then((action) => {
      if (action && !action.error) {
        this.toggleShow();
      }
    });
  };

  render() {
    const {
      handleSubmit,
      submitting,
      valid,
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
          <button className="btn btn-sm" onClick={this.toggleShow} >
            +ADD
          </button>
        }

        {
          this.state.show &&
            <form onSubmit={handleSubmit(this.handleSubmitAndHide)}>
              <div className="filter-row">
                <div className="filter-row__medium">
                  <Field
                    name="department"
                    label={attributeLabels.department}
                    type="text"
                    component={SelectField}
                    position="vertical"
                  >
                    <option value="">Select</option>
                    {
                      availableDepartments.map(({ label, value }) => (
                        <option key={value} value={value}>
                          { renderLabel(label, departmentsLabels) }
                        </option>
                      ))
                    }
                  </Field>
                </div>
                <div className="filter-row__medium">
                  <Field
                    name="role"
                    label={attributeLabels.role}
                    type="text"
                    component={SelectField}
                    position="vertical"
                  >
                    <option value="">Select</option>
                    {
                      roles.map(({ label, value }) => (
                        <option key={value} value={value}>
                          { renderLabel(label, rolesLabels) }
                        </option>
                      ))
                    }
                  </Field>
                </div>
                <div className="filter-row__button-block">
                  <div className="button-block-container">
                    <button
                      disabled={submitting || !valid}
                      className="btn btn-primary"
                      type="submit"
                    >
                      Save
                    </button>
                    <button
                      onClick={this.toggleShow}
                      className="btn btn-default"
                      type="reset"
                    >
                      Cancel
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
  validate: validator,
})(DepartmentsForm);
