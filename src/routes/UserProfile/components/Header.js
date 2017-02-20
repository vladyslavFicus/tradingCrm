import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Amount from 'components/Amount';
import ProfileTags from 'components/ProfileTags';

class Header extends Component {
  getUserAge = () => {
    const { data: { birthDate } } = this.props;

    return birthDate ? `(${moment().diff(birthDate, 'years')})` : null;
  };

  handleTagAdd = (option) => {
    this.props.addTag(option.value, option.priority);
  };

  handleTagDelete = (option) => {
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
        btag,
        affiliateId,
        profileStatus,
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
              onAdd={this.handleTagAdd}
              options={availableOptions}
              value={valueOptions}
              onDelete={this.handleTagDelete}
            />}
          </div>
        </div>

        <div className="row panel-body">
          <div className="player__account__status col-md-2">
            <a href="#">
              <span className="player__account__status-label text-uppercase">Account Status</span>
              <div className="player__account__status-current-active">{profileStatus}</div>
            </a>
          </div>
          <div className="player__account__balance col-md-3">
            <a href="#">
              <span className="player__account__balance-label text-uppercase">Balance</span>
              <div className="player__account__balance-current">
                <Amount { ...balance } />
              </div>
            </a>
          </div>
          <div className="player__account__registered col-md-2">
            <span className="player__account__registered-label text-uppercase">Registered</span>
            <div className="player__account__registered-current">
              { moment(registrationDate).fromNow() }
            </div>
            <small className="player__account__registered-date">
              on { moment(registrationDate).format('DD.MM.YYYY') } <br/>
            </small>
          </div>
          <div className="player__account__lastlogin col-md-2">
            <span className="player__account__lastlogin-label text-uppercase">Last login</span>
            <div className="player__account__lastlogin-current">
              13 Days ago
            </div>
            <small className="player__account__lastlogin-date">on 13.09.2016 13:00</small>
          </div>
          <div className="player__account__affiliate col-md-3">
            <span className="player__account__affiliate-label text-uppercase">
              Affiliate {' '} { !!affiliateId && affiliateId}
            </span>
            <div className="player__account__affiliate-current">
              BTAG {' '} { !!btag && btag }
            </div>
          </div>
        </div>
      </div>

    );
  }
}

Header.propTypes = {};
Header.defaultProps = {};

export default Header;
