import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.min.css';

import './NewLayout.scss';

class NewLayout extends Component {
  render() {
    const { children } = this.props;

    return <div>
      {this.renderHeader()}
      {this.renderSidebar()}
      {this.renderTabs(children)}
    </div>;
  }

  renderHeader() {
    return (
      <header>
        <nav className="navbar fixed-top navbar-toggleable navbar-inverse bg-inverse">

          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>

          <a className="navbar-brand" href="#">
            <img src="http://dxlfb468n8ekd.cloudfront.net/gsc/YXLK5A/81/37/cd/8137cd9157d3485280ea94bb3658c013/images/bo_header/u11598.png?token=c6a7f3fb262045340fe683845ff8347a" alt="logo" />
          </a>

          <div className="collapse navbar-collapse align-items-center" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item dropdown dropdown__left mx-sm-3 align-self-sm-center">
                <a className="nav-link active dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Customer Service<i className="fa fa-angle-down" />
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <a className="dropdown-item" href="#">Action</a>
                  <a className="dropdown-item" href="#">Another action</a>
                  <a className="dropdown-item" href="#">Something else here</a>
                </div>
              </li>
              <form className="form-inline">
                <i className="fa fa-search" aria-hidden="true" /><input className="form-control" type="text" placeholder="Type to search" />
                  {/*<button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>*/}
              </form>
            </ul>
            <ul className="navbar-nav navigation-right">
              <li className="nav-item active">
                <i className="fa fa-bell" />
              </li>
              <li className="nav-item ml-sm-5">
                <i className="fa fa-star" />
              </li>
              <li className="nav-item ml-sm-5">
                <i className="fa fa-user" />
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }

  renderSidebar() {
    return <aside>
      Sidebar
    </aside>;
  }

  renderTabs = (children) => {
    return <footer>

      {children}

    </footer>;
  };
}

export default NewLayout;

