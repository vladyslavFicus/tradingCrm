import React, { Component, PropTypes } from 'react';
import { IndexLink, withRouter } from 'react-router';
import { SubmissionError } from 'redux-form';
import { actionTypes as authActionTypes } from '../../../redux/modules/auth';
import SignInForm from './SignInForm';

class SignIn extends Component {
  static propTypes = {
    signIn: PropTypes.func.isRequired,
    departments: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
  };

  componentWillMount() {
    document.body.classList.add('full-height');
  }

  componentWillUnmount() {
    document.body.classList.remove('full-height');
  }

  handleSubmit = data => this.props.signIn(data)
    .then((action) => {
      if (action) {
        if (action.type === authActionTypes.SIGN_IN.SUCCESS) {
          this.props.router.replace('/');
        } else if (action.error) {
          const _error = action.payload.response.error ?
            action.payload.response.error : action.payload.message;
          throw new SubmissionError({ _error });
        }
      }
    });

  render() {
    const { departments } = this.props;

    return (
      <section className="page-content">
        <div className="page-content-inner" style={{ background: '#0e1836' }}>
          <div className="single-page-block-header">
            <div className="row">
              <div className="col-lg-4">
                <div className="logo">
                  <IndexLink to="/" className="logo" style={{ fontSize: `${32}px` }}>
                    <span style={{ color: '#e7edff' }}>NEW</span>
                    <span style={{ color: 'rgb(26, 122, 175)' }}>AGE</span>
                  </IndexLink>
                </div>
              </div>
            </div>
          </div>
          <div className="single-page-block">
            <div className="single-page-block-inner effect-3d-element" ref="innerBlock">
              <h2>Sign in</h2>
              <div className="single-page-block-form">
                <br />
                <SignInForm
                  departments={departments}
                  onSubmit={this.handleSubmit}
                />
              </div>
            </div>
          </div>
          <div className="single-page-block-footer text-center" />
        </div>
      </section>
    );
  }
}

export default withRouter(SignIn);

