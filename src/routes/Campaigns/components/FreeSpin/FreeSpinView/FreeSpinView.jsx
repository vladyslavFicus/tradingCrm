import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import get from 'lodash/get';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { NasSelectField } from '../../../../../components/ReduxForm';
import Placeholder from '../../../../../components/Placeholder';

export default class FreeSpinView extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    freeSpinTemplates: PropTypes.shape({
      freeSpinTemplates: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
      })),
    }).isRequired,
    freeSpinTemplate: PropTypes.shape({
      freeSpinTemplate: PropTypes.shape({
        data: PropTypes.shape({
          uuid: PropTypes.string,
          status: PropTypes.string,
        }),
      }),
    }),
  };

  static defaultProps = {
    freeSpinTemplate: {},
  };

  render() {
    const {
      uuid,
      freeSpinTemplates: {
        freeSpinTemplates,
      },
      name,
      freeSpinTemplate: {
        freeSpinTemplate,
      },
    } = this.props;
    const fsTemplates = freeSpinTemplates || [];
    const fsTemplate = get(freeSpinTemplate, 'data', {});

    return (
      <div className="free-spin-template">
        <div className="row">
          <div className="col-8">
            <Field
              name={`${name}.uuid`}
              id={`${name}-uuid`}
              label="Free-spin template"
              component={NasSelectField}
              showErrorMessage={false}
              position="vertical"
            >
              {fsTemplates.map(item => (
                <option key={item.uuid} value={item.uuid}>
                  {item.name}
                </option>
              ))}
            </Field>
          </div>
        </div>
        <If condition={uuid}>
          <Placeholder
            ready={!!fsTemplate.uuid}
            className={null}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '80%', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '80%', height: '12px' }} />
                <TextRow className="animated-background" style={{ width: '80%', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '80%', height: '12px' }} />
                <TextRow className="animated-background" style={{ width: '80%', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '80%', height: '12px' }} />
              </div>
            )}
          >
            <div>
              <div className="row">
                <div className="col-4 free-spin-template__item">
                  <div className="free-spin-template">Provider</div>
                  <div>
                    <div className="free-spin-template">{fsTemplate.providerId}</div>
                  </div>
                </div>
                <div className="col-4 free-spin-template__item">
                  <div className="free-spin-template">Game</div>
                  <div>
                    <div className="free-spin-template">{fsTemplate.gameId}</div>
                  </div>
                </div>
                <div className="col-4 free-spin-template__item">
                  <div className="free-spin-template">status</div>
                  <div>
                    <div className="free-spin-template">{fsTemplate.status}</div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-4 free-spin-template__item">
                  <div className="free-spin-template">Free-spins</div>
                  <div>
                    <div className="free-spin-template">{fsTemplate.freeSpinsAmount}</div>
                  </div>
                </div>
                <div className="col-4 free-spin-template__item">
                  <div className="free-spin-template">Life Time</div>
                  <div>
                    <div className="free-spin-template">{fsTemplate.freeSpinLifeTime}</div>
                  </div>
                </div>
              </div>
              <div className="row">
                <If condition={fsTemplate.linesPerSpin}>
                  <div className="col-4 free-spin-template__item">
                    <div className="free-spin-template">lines per spin</div>
                    <div>
                      <div className="free-spin-template">{fsTemplate.linesPerSpin}</div>
                    </div>
                  </div>
                </If>
                <If condition={fsTemplate.betPerLine}>
                  <div className="col-4 free-spin-template__item">
                    <div className="free-spin-template">Bet per line</div>
                    <div>
                      <div className="free-spin-template">{fsTemplate.betPerLine}</div>
                    </div>
                  </div>
                </If>
              </div>
              <div className="row">
                <If condition={fsTemplate.coinSize}>
                  <div className="col-4 free-spin-template__item">
                    <div className="free-spin-template">Coin size</div>
                    <div>
                      <div className="free-spin-template">{fsTemplate.coinSize}</div>
                    </div>
                  </div>
                </If>
                <If condition={fsTemplate.betLevel}>
                  <div className="col-4 free-spin-template__item">
                    <div className="free-spin-template">Bet level</div>
                    <div>
                      <div className="free-spin-template">{fsTemplate.betLevel}</div>
                    </div>
                  </div>
                </If>
                <If condition={fsTemplate.pageCode}>
                  <div className="col-4 free-spin-template__item">
                    <div className="free-spin-template">Page code</div>
                    <div>
                      <div className="free-spin-template">{fsTemplate.pageCode}</div>
                    </div>
                  </div>
                </If>
              </div>
              <div className="row">
                <If condition={fsTemplate.betMultiplier}>
                  <div className="col-4 free-spin-template__item">
                    <div className="free-spin-template">Bet Per Line</div>
                    <div>
                      <div className="free-spin-template">{fsTemplate.betMultiplier}</div>
                    </div>
                  </div>
                </If>
                <If condition={fsTemplate.rhfpBet}>
                  <div className="col-4 free-spin-template__item">
                    <div className="free-spin-template">Bet level</div>
                    <div>
                      <div className="free-spin-template">{fsTemplate.rhfpBet}</div>
                    </div>
                  </div>
                </If>
                <If condition={fsTemplate.comment}>
                  <div className="col-4 free-spin-template__item">
                    <div className="free-spin-template">Comment</div>
                    <div>
                      <div className="free-spin-template">{fsTemplate.comment}</div>
                    </div>
                  </div>
                </If>
              </div>
            </div>
          </Placeholder>
        </If>
      </div>
    );
  }
}
