import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { SelectField } from '../../../../../../../components/ReduxForm';
import PropTypes from '../../../../../../../constants/propTypes';
import { createValidator } from '../../../../../../../utils/validator';
import { departmentsLabels, rolesLabels } from '../../../../../../../constants/operators';
import { renderLabel } from '../../../../../utils';

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
            <div className="row">
              <div className="col-lg-10">
                <form
                  onSubmit={handleSubmit(this.handleSubmitAndHide)}
                >
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <Field
                          name="department"
                          label={attributeLabels.department}
                          type="text"
                          component={SelectField}
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
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <Field
                          name="role"
                          label={attributeLabels.role}
                          type="text"
                          component={SelectField}
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
                    </div>
                    <div className="col-md-4 padding-top-30">
                      <button
                        className="btn btn-sm btn-primary margin-right-10"
                        type="submit"
                        disabled={submitting || !valid}
                      >
                        Save
                      </button>
                      <button
                        onClick={this.toggleShow}
                        className="btn btn-sm"
                        type="reset"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
        }
      </div>
    );
  }
}

export default reduxForm({
  form: 'operatorDepartmentsEdit',
  validate: validator,
})(DepartmentsForm);
