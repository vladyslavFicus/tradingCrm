import React, { Component, PropTypes } from 'react';
import ProfileTags from 'components/ProfileTags';
import moment from 'moment';
import Amount from 'components/Amount';

class Header extends Component {
  getUserAge = () => {
    const { data: { birthDate } } = this.props;

    return birthDate ? `(${moment().diff(birthDate, 'years')})` : null;
  };

  handleSelectAddValue = (option) => {
    this.props.addTag(option.value, option.priority);
  };

  handleSelectDeleteValue = (option) => {
    this.props.deleteTag(option.id);
  };

  render() {
    const {
      data: {
        balance,
        registrationDate,
        firstName,
        lastName,
        username,
        uuid,
        languageCode,
        profileTags,
      },
      availableTags,
    } = this.props;
    const selectedTags = profileTags
      ? profileTags.map(option => `${option.tagPriority}/${option.tag}`)
      : [];
    const availableOptions = selectedTags && availableTags
      ? availableTags.filter(option => selectedTags.indexOf(`${option.priority}/${option.value}`) === -1)
      : [];
    const valueOptions = profileTags
      ? profileTags.map(option => ({
        id: option.id,
        label: option.tag,
        value: option.tag,
        priority: option.tagPriority,
      }))
      : [];

    return (
      <div>
        <div className="row panel-heading">
          <div className="col-md-4">
            <h1 className="player__account__name">
              {[firstName, lastName, this.getUserAge()].join(' ')}
              <i className="green fa fa-check"/>
            </h1>
            <span className="player__account__ids">
                {[username, uuid, languageCode].join(' - ')}
              </span>
          </div>
          <div className="col-md-4">
            {profileTags && <ProfileTags
              onSelectValue={this.handleSelectAddValue}
              options={availableOptions}
              value={valueOptions}
              onDeleteValue={this.handleSelectDeleteValue}
            />}
          </div>
          <div className="col-md-4">
            <button type="button" className="btn margin-inline">Add note</button>
            <button type="button" className="btn margin-inline">Reset password</button>
          </div>
        </div>

        <div className="row panel-body">
          <div className="player__account__status col-md-2">
            <a href="#">
              <span className="player__account__status-label text-uppercase">Account Status</span>
              <div className="player__account__status-current-active">Active</div>
              <small className="player__account__status-scince">Since 15.11.2016</small>
            </a>
          </div>
          <div className="player__account__balance col-md-3">
            <a href="#">
              <span className="player__account__balance-label text-uppercase">Balance</span>
              <div className="player__account__balance-current">
                <Amount { ...balance } />
              </div>
              <small className="player__account__balance-additional">RM €15.205,00 + BM €5.000,00</small>
            </a>
          </div>
          <div className="player__account__registered col-md-2">
            <span className="player__account__registered-label text-uppercase">Registered</span>
            <div className="player__account__registered-current">
              { moment(registrationDate).fromNow() }
            </div>
            <small className="player__account__registered-date">
              on { moment(registrationDate).format('DD.MM.YYYY') } <br/>
              from Ukraine
            </small>
          </div>
          <div className="player__account__lastlogin col-md-2">
            <span className="player__account__lastlogin-label text-uppercase">Last login</span>
            <div className="player__account__lastlogin-current">
              13 Days ago
            </div>
            <small className="player__account__lastlogin-date">on 13.09.2016 13:00<br/> from Ukraine</small>
          </div>
          <div className="player__account__affiliate col-md-3">
            <span className="player__account__affiliate-label text-uppercase">Affiliate</span>
            <div className="player__account__affiliate-current">BTAG 97897897897897879876</div>
          </div>
        </div>
      </div>

    );
  }
}

Header.propTypes = {};
Header.defaultProps = {};

export default Header;
