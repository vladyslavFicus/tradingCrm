import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { actionTypes as authActionTypes } from 'redux/modules/auth';
import { SubmissionError } from 'redux-form';
import SignInForm from './SignInForm';

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit({ login, password }) {
    return this.props.signIn({ login, password })
      .then((action) => {
        if (action.type === authActionTypes.SIGN_IN.SUCCESS) {
          this.props.router.replace('/');
        } else if (action.error) {
          const _error = action.payload.response.error ?
            action.payload.response.error : action.payload.message;
          throw new SubmissionError({ _error });
        }
      });
  }

  componentWillMount() {
    document.body.classList.add('full-height');
  }

  componentWillUnmount() {
    document.body.classList.remove('full-height');
  }

  render() {
    return <section className="page-content">
      <div className="page-content-inner" style={{ background: '#0e1836' }}>
        <div className="single-page-block-header">
          <div className="row">
            <div className="col-lg-4">
              <div className="logo">
                <a href='/' className="logo" style={{ fontSize: 32 + 'px' }}>
                  <span style={{ color: '#e7edff' }}>NEW</span><span style={{ color: 'rgb(26, 122, 175)' }}>AGE</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="single-page-block">
          <div className="single-page-block-inner effect-3d-element" ref="innerBlock">
            <h2>Sign in</h2>
            <div className="single-page-block-form">
              <br/>
              <SignInForm
                onSubmit={this.handleSubmit}
              />
            </div>
          </div>
        </div>
        <div className="single-page-block-footer text-center"></div>

      </div>
    </section>;
  }
}

SignIn.propTypes = {
  signIn: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default withRouter(SignIn);

