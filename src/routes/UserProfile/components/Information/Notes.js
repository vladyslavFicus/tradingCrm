import React, { Component, PropTypes } from 'react';

class Notes extends Component {
  render() {
    return (
      <div className="player__account__details_notes col-md-4">
        <span className="player__account__details_notes-label">Pined note's</span>
        <div className="panel panel-with-borders">
          <div className="notes panel-body">

            <div className="note panel panel-with-borders">
              <div className="note-content panel-body panel-yellow">
                <div><b>Helen Cassar</b> - OP-777h1634</div>
                <small>2016-10-20 17:20:07 to TA-345d5445</small><br/>
                <div className="font-size-10">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard ...
                </div>
              </div>
            </div>
            <div className="note panel panel-with-borders">
              <div className="note-content panel-body panel-yellow">
                <div><b>Helen Cassar</b> - OP-777h1634</div>
                <small>2016-10-20 17:20:07 to TA-345d5445</small><br/>
                <div className="font-size-10">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard ...
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    );
  }
}

Notes.propTypes = {};
Notes.defaultProps = {};

export default Notes;
