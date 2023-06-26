import React from 'react';
import I18n from 'i18n-js';
import { isObject } from 'lodash';
import { renderValue, renderLabel } from './utils';
import './FeedDetails.scss';

type Detail = {
  from?: string,
  to?: string,
  elements?: Array<Detail>,
  value?: string | Detail,
  changeType?: 'ADDED' | 'CHANGED' | 'REMOVED',
};

type Details = {
  [key: string]: Detail,
};

type Props = {
  details: Details,
};

const FeedDetails = (props: Props) => {
  const { details } = props;

  const formatTypeChangedElements = (array: Array<Detail>, type: string) => array
    .filter(({ changeType }) => changeType === type)
    .map(({ value }) => value);

  return (
    <>
      {Object.entries(details).map(([key, detailValue]) => (
        <div key={key}>
          <Choose>
            {/* Render markup for field which was added */}
            <When condition={detailValue?.changeType === 'ADDED'}>
              <div>
                <span className="FeedDetails__label">{renderLabel(key)}:</span>
                <span className="FeedDetails__value-to">{renderValue(key, detailValue?.value)}</span>
              </div>
            </When>

            {/* Render markup for field which was removed */}
            <When condition={detailValue?.changeType === 'REMOVED'}>
              <div>
                <span className="FeedDetails__label">{renderLabel(key)}:</span>
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
                  <span className="FeedDetails__label">{renderLabel(key)}:</span>

                  {/* Render removed elements from array */}
                  {formatTypeChangedElements(detailValue.elements as Array<Detail>, 'REMOVED').map(value => (
                    <span className="FeedDetails__value-removed">{value}</span>
                  ))}

                  {/* Render added elements to array */}
                  {formatTypeChangedElements(detailValue.elements as Array<Detail>, 'ADDED').map(value => (
                    <span className="FeedDetails__value-added">{value}</span>
                  ))}
                </When>

                {/* If CHANGED type and field isn't array -> render default changed field markup */}
                <Otherwise>
                  <div>
                    <span className="FeedDetails__label">{renderLabel(key)}:</span>
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
                <span className="FeedDetails__label">{renderLabel(key)}:</span>
                <span className="FeedDetails__value-to">{renderValue(key, detailValue)}</span>
              </div>
            </When>
          </Choose>
        </div>
      ))}
    </>
  );
};

export default React.memo(FeedDetails);
