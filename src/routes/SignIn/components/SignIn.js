import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IndexLink, withRouter } from 'react-router';
import { SubmissionError } from 'redux-form';
import classNames from 'classnames';
import { actionTypes as authActionTypes } from '../../../redux/modules/auth';
import SignInForm from './SignInForm';
import './SignInBase.scss';
import './SignIn.scss';
import SignInBrands from './SignInBrands';
import SignInDepartments from './SignInDepartments';

class SignIn extends Component {
  static propTypes = {
    router: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({
        returnUrl: PropTypes.string,
      }),
    }).isRequired,
    signIn: PropTypes.func.isRequired,
    departments: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
  };

  state = {
    step: 0,
  };

  componentWillMount() {
    document.body.classList.add('sign-in-page');
  }

  componentWillUnmount() {
    document.body.classList.remove('sign-in-page');
  }

  toggleStep2 = () => {
    this.setState({ step: 2 });
  };

  toggleStep3 = () => {
    this.setState({ step: 3 });
  };

  goToBrandStep = () => {
    this.setState({
      step: 1,
    });

    // clear timeout when componentWillUnmount
    setTimeout(this.toggleStep2, 350);
    setTimeout(this.toggleStep3, 350);
  };

  toggleStep5 = () => {
    this.setState({ step: 5 });
  };

  toggleStep6 = () => {
    this.setState({ step: 6 });
  };

  toggleStep7 = () => {
    this.setState({ step: 7 });
  };

  chooseBrand = brandName => () => {
    this.setState({
      step: 4,
      brandName,
    });

    setTimeout(this.toggleStep5, 500);
    setTimeout(this.toggleStep6, 550);
    setTimeout(this.toggleStep7, 600);
  };

  handleSubmit = async (data) => {
    this.goToBrandStep();
  };

  handleSelectBrand = (brand) => {
    console.log(`Selected brand: ${brand}`);
  };

  handleSelectDepartment = (department) => {
    console.log(`Selected department: ${department}`);
  };

  render() {
    const { step } = this.state;

    return (
      <div>
        <div id="preloader fade">
          <div className="loader" />
        </div>

        <div className="wrapper">
          <div className="sign-in">
            <div className="sign-in__logo">
              <img src="/img/horizon-logo.svg" alt="logo" />
            </div>

            <div className={classNames('sign-in__form', {
              fadeOutLeft: step > 0, // step 1
              'position-absolute': step > 1, // step 2
            })}
            >
              <SignInForm onSubmit={this.handleSubmit} />
            </div>

            <SignInBrands
              username={'Helen'}
              brands={['hrzn_dev2', 'vslots_prod', 'hrzn_stage']}
              onSelect={this.handleSelectBrand}
            />

            <SignInDepartments
              username={'Helen'}
              brands={['hrzn_dev2', 'vslots_prod', 'hrzn_stage']}
              onSelect={this.handleSelectBrand}
            />

            <div
              className={classNames('sign-in__department', {
                fadeInUp: step > 5,
                fadeOutDown: step < 6,
              })}
            >
              <div
                className="sign-in__department_return"
              >
                All <span className="return-label">brands</span>
              </div>
              <div
                className={classNames('sign-in__multibrand_call-to-action', {
                  // 'fadeOut-text': step > 6,
                })}
              >
                And now, choose the department
              </div>
              <div className="sign-in__department_block">
                <div
                  className="department-item"
                >
                  <div>
                    <img src="/img/cs-dep-icon.svg" alt="department" />
                  </div>
                  <div className="department-item_details">
                    <div className="department-name">
                      Customer service
                    </div>
                    <div className="departmnet-role">
                      Head of department
                    </div>
                  </div>
                </div>
                <div
                  className="department-item"
                >
                  <div>
                    <img src="/img/rfp-dep-logo.svg" alt="department" />
                  </div>
                  <div className="department-item_details">
                    <div className="department-name">
                      Risk Fraud & Payments
                    </div>
                    <div className="departmnet-role">
                      Team Leader
                    </div>
                  </div>
                </div>
                <div
                  className="department-item"
                >
                  <div>
                    <img src="/img/casino-crm-dep-logo.svg" alt="department" />
                  </div>
                  <div className="department-item_details">
                    <div className="department-name">
                      Casino & CRM
                    </div>
                    <div className="departmnet-role">
                      Team Leader
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sign-in__copyright">
          Copyright © 2017 by Newage
        </div>
      </div>
    );
  }
}

export default SignIn;

