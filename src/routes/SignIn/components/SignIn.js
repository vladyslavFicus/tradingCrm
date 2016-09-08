import React, { Component, PropTypes } from 'react';
import SignInForm from './Forms/SignIn';

class SignIn extends Component {
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
              <SignInForm {...this.props}/>
            </div>
          </div>
        </div>
        <div className="single-page-block-footer text-center"></div>

      </div>
    </section>;
  }
}

export default SignIn;

