import React, { Component, PropTypes } from 'react';
import SignInForm from './Forms/SignIn';
import BackgroundImage from 'static/img/temp/login/2.jpg';

class SignIn extends Component {
  componentWillMount() {
    document.body.classList.add('full-height');
  }

  componentWillUnmount() {
    document.body.classList.remove('full-height');
  }

  render() {
    return <section className="page-content">
      <div className="page-content-inner" style={{ backgroundImage: `url(${BackgroundImage})` }}>
        <div className="single-page-block-header">
          <div className="row">
            <div className="col-lg-4">
              <div className="logo">
                <a href="./">
                  <img src="/img/logo-inverse.png" alt="Clean UI Admin Template"/>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="single-page-block">
          <div className="single-page-block-inner effect-3d-element" ref="innerBlock">
            <div className="blur-placeholder" style={{ backgroundImage: `url(${BackgroundImage})` }}>&nbsp;</div>
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

