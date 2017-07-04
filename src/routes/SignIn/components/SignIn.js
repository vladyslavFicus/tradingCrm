import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IndexLink, withRouter } from 'react-router';
import { SubmissionError } from 'redux-form';
import classNames from 'classnames';
import { actionTypes as authActionTypes } from '../../../redux/modules/auth';
import SignInForm from './SignInForm';
import './SignInBase.scss';
import './SignIn.scss';

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
    document.body.classList.add('full-height');
  }

  componentWillUnmount() {
    document.body.classList.remove('full-height');
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

    //clear timeout when componentWillUnmount
    setTimeout(this.toggleStep2, 350);
    setTimeout(this.toggleStep3, 351);
  }

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
  }

  handleSubmit = async (data) => {
    this.goToBrandStep();


    // const { location, router, signIn } = this.props;
    // const action = await signIn(data);
    //
    // if (action) {
    //   if (action.type === authActionTypes.SIGN_IN.SUCCESS) {
    //     let nextUrl = '/';
    //
    //     if (location.query && location.query.returnUrl && !/sign\-in/.test(location.query.returnUrl)) {
    //       nextUrl = location.query.returnUrl;
    //     }
    //
    //     router.replace(nextUrl);
    //   } else if (action.error) {
    //     const error = action.payload.response.error ?
    //       action.payload.response.error : action.payload.message;
    //     throw new SubmissionError({ _error: error });
    //   }
    // }
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
              <SignInForm
                //departments={departments}
                onSubmit={this.handleSubmit}
              />
            </div>

            <div
              className={classNames('sign-in__multibrand', {
                fadeInUp: step > 2, // step 3
              })}
            >
              <div
                className={classNames('sign-in__multibrand_heading', {
                  'fadeOut-text': step > 6,
                })}
              >
                Good morning, <span className="heading-name">Helen</span>!
              </div>
              <div
                className={classNames('sign-in__multibrand_call-to-action', {
                  'fadeOut-text': step > 6,
                })}
              >
                Please, choose the brand
              </div>
              <div
                className={classNames('sign-in__multibrand_choice', {
                  chosen: step > 6,
                })}
              >
                {/* use map for brands */}
                <div
                  className={classNames('choice-item', {
                    fadeOut: this.state.brandName !== 'firstBrand' && step > 3,
                    'remove-block': this.state.brandName !== 'firstBrand' && step > 4,
                    'position-absolute': this.state.brandName !== 'firstBrand' && step > 4,
                    'chosen-brand': this.state.brandName === 'firstBrand' && step > 6,
                  })}
                  onClick={this.chooseBrand('firstBrand')}
                >
                  <div>
                    <img src="/img/vslot-brand-logo.png" alt="logotype" />
                  </div>
                  <div className="choice-item_label">
                    vslots
                  </div>
                </div>

                <div
                  className={classNames('choice-item', {
                    fadeOut: this.state.brandName !== 'secondBrand' && step > 3,
                    'remove-block': this.state.brandName !== 'secondBrand' && step > 4,
                    'position-absolute': this.state.brandName !== 'secondBrand' && step > 4,
                    'chosen-brand': this.state.brandName === 'secondBrand' && step > 6,
                  })}
                  onClick={this.chooseBrand('secondBrand')}
                >
                  <div>
                    <img src="/img/loki-brand-logo.png" alt="logotype" />
                  </div>
                  <div className="choice-item_label">
                    loki casino
                  </div>
                </div>

                <div
                  className={classNames('choice-item', {
                    fadeOut: this.state.brandName !== 'thirdBrand' && step > 3,
                    'remove-block': this.state.brandName !== 'thirdBrand' && step > 4,
                    'position-absolute': this.state.brandName !== 'thirdBrand' && step > 4,
                    'chosen-brand': this.state.brandName === 'thirdBrand' && step > 6,
                  })}
                  onClick={this.chooseBrand('thirdBrand')}
                >
                  <div>
                    <img src="/img/nascasino-brand-logo.png" alt="logotype" />
                  </div>
                  <div className="choice-item_label">
                    nascasino
                  </div>
                </div>
              </div>
            </div>

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
                  //'fadeOut-text': step > 6,
                })}
              >
                And now, choose  the department
              </div>
              <div className="sign-in__department_block">
                <div
                  className="department-item"
                >
                  <div>
                    <img src="assets/img/cs-dep-icon.svg" alt="department" />
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
                    <img src="assets/img/rfp-dep-logo.svg" alt="department" />
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
                    <img src="assets/img/casino-crm-dep-logo.svg" alt="department" />
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
          Copyright  © 2017 by Newage
        </div>
      </div>
    );
  }

  // render() {
  //   const { departments } = this.props;
  //
  //   return (
  //     <section className="page-content">
  //       <div className="page-content-inner" style={{ background: '#0e1836' }}>
  //         <div className="single-page-block-header">
  //           <div className="row">
  //             <div className="col-lg-4">
  //               <div className="logo">
  //                 <IndexLink to="/" className="logo" style={{ fontSize: `${32}px` }}>
  //                   <span style={{ color: '#e7edff' }}>NEW</span>
  //                   <span style={{ color: 'rgb(26, 122, 175)' }}>AGE</span>
  //                 </IndexLink>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //         <div className="single-page-block">
  //           <div className="single-page-block-inner effect-3d-element" ref="innerBlock">
  //             <h2>Sign in</h2>
  //             <div className="single-page-block-form">
  //               <br />
  //               <SignInForm
  //                 departments={departments}
  //                 onSubmit={this.handleSubmit}
  //               />
  //             </div>
  //           </div>
  //         </div>
  //         <div className="single-page-block-footer text-center" />
  //       </div>
  //     </section>
  //   );
  // }
}

export default SignIn;

