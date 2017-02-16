import React, { Component, PropTypes } from 'react';
import moment from 'moment';

class Information extends Component {
  render() {
    const {
      data: {
        birthDate,
        gender,
        phoneNumber,
        email,
        country,
        address,
      },
    } = this.props;

    return (
      <div className="player__account__details row panel-body">

        <div className="player__account__details_personal col-md-3">
          <span className="player__account__details_personal-label">Personal information</span>
          <div className="panel panel-with-borders">
            <div className="panel-body padding-5">
              {
                !!birthDate &&
                <div><b>Date of birth</b>: {moment(birthDate).format('DD.MM.YYYY')}</div>
              }
              {
                !!gender &&
                <div><b>Gender</b>: {gender}</div>
              }
              {
                !!phoneNumber &&
                <div><b>Phone</b>: {phoneNumber}</div>
              }
              {
                !!email &&
                <div><b>Email</b>: {email}</div>
              }

              {
                !!country &&
                <div><b>Country</b>: {country}</div>
              }
              {
                !!address &&
                <div><b>Address</b>: {address}</div>
              }
            </div>
          </div>
        </div>

        <div className="player__account__details_additional col-md-3">
          <span className="player__account__details_additional-label">Additional information</span>
          <div className="panel panel-with-borders">
            <div className="panel-body padding-5">
              <small className="player__account__details_additional-label">
                Marketing
              </small>
              <div><b>SMS</b>: true</div>
              <div><b>News</b>: true</div>
              <div><b>Snail mail</b>: false</div>

              <small className="player__account__details_additional-label">
                Segments
              </small><br />
              <small className="label label-default">Bonus hater</small>
              <small className="label label-primary">Bonus hater</small>
              <small className="label label-danger">Bonus hater</small>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

Information.propTypes = {};
Information.defaultProps = {};

export default Information;
