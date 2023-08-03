import React from 'react';
import I18n from 'i18n-js';
import { isObject } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Detail, Details } from 'components/FeedItem/types';
import useFeedDetails from 'components/FeedItem/hooks/useFeedDetails';
import { renderLabel, renderValue } from 'components/FeedItem/utils';
import './FeedDetails.scss';

type Props = {
  details: Details,
  separator?: boolean,
};

const FeedDetails = (props: Props) => {
  const { details, separator } = props;

  const {
    getChangedElements,
  } = useFeedDetails();

  return (
    <>
      {Object.entries(details).map(([key, detailValue]) => (
        <div key={`${uuidv4()}-${key}`}>
          <Choose>
            {/* Render markup for field which was added */}
            <When condition={detailValue?.changeType === 'ADDED'}>
              <div>
                <span className="FeedDetails__label">{renderLabel(key)}: </span>
                <span className="FeedDetails__value-to">{renderValue(key, detailValue?.value)}</span>
              </div>
            </When>

            {/* Render markup for field which was removed */}
            <When condition={detailValue?.changeType === 'REMOVED'}>
              <div>
                <span className="FeedDetails__label">{renderLabel(key)}: </span>
                <span className="FeedDetails__value-from">{renderValue(key, detailValue?.value)}</span>
                <span className="FeedDetails__arrow" />
                <span className="FeedDetails__value-to">&laquo; &raquo;</span>
              </div>
            </When>

            {/* Render markup for field which was changed */}
            <When condition={detailValue?.changeType === 'CHANGED'}>
              <Choose>
                {/* In CHANGED type can be an array which also has REMOVED and ADDED elements in array */}
                <When condition={Array.isArray(detailValue?.elements)}>
                  <div className="FeedDetails__columns">
                    <span className="FeedDetails__label">{renderLabel(key)}: </span>

                    {/* Render removed and added elements from array */}
                    {getChangedElements(detailValue.elements as Array<Detail>).map(({ value, type }) => (
                      <span key={uuidv4()} className={`FeedDetails__value-${type.toLowerCase()}`}>
                        <Choose>
                          <When condition={isObject(value)}>
                            <FeedDetails details={value as Details} separator />
                          </When>

                          <Otherwise>
                            {value},
                          </Otherwise>
                        </Choose>
                      </span>
                    ))}
                  </div>
                </When>

                {/* If CHANGED type and field isn't array -> render default changed field markup */}
                <Otherwise>
                  <div>
                    <span className="FeedDetails__label">{renderLabel(key)}: </span>
                    <span className="FeedDetails__value-from">{renderValue(key, detailValue?.from)}</span>
                    <span className="FeedDetails__arrow" />
                    <span className="FeedDetails__value-to">{renderValue(key, detailValue?.to)}</span>
                  </div>
                </Otherwise>
              </Choose>
            </When>

            {/* Recursive render details fields if details value is object (need to traverse all nested objects) */}
            <When condition={isObject(detailValue)}>
              {/* Render === CHANGES === block to delimit base entity from changed fields */}
              <If condition={key === 'changes'}>
                <div className="FeedDetails__changes">
                  <span className="FeedDetails__arrow FeedDetails__arrow--down" />
                  <span>{I18n.t('COMMON.CHANGES')}</span>
                  <span className="FeedDetails__arrow FeedDetails__arrow--down" />
                </div>
              </If>

              {/* Go to recursion to render nested object values */}
              <FeedDetails details={detailValue as Details} />
            </When>

            {/* In all other cases (simple string, number, boolean) -> just render simple default markup */}
            <When condition={detailValue !== null}>
              <div>
                <span className="FeedDetails__label">{renderLabel(key)}: </span>
                <span className="FeedDetails__value-to">{renderValue(key, detailValue)}</span>

                <If condition={!!separator}>
                  {', '}
                </If>
              </div>
            </When>
          </Choose>
        </div>
      ))}
    </>
  );
};

export default React.memo(FeedDetails);
