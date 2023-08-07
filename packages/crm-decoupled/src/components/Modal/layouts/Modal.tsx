import React from 'react';
import ReactModal from 'react-modal';
import classNames, { Argument } from 'classnames';
import I18n from 'i18n-js';
import { Button } from 'components';
import { ReactComponent as CloseIcon } from './img/close.svg';
import './Modal.scss';

type StyleButton = 'primary' | 'secondary' | 'danger' | 'success';

type Props = {
  title: string | React.ReactNode, // Title of modal
  children: React.ReactNode, // Fields and all what can include modal in body
  warning?: boolean, // Change style for header (danger)
  bigSize?: boolean, // Change size for modal with too big content
  buttonTitle?: string, // Text which we show in submit button
  disabled?: boolean, // Condition for disabling submit button
  styleButton?: StyleButton, // Change color for submit button
  renderFooter?: React.ReactNode, // We check this value and change default footer
  note?: React.ReactNode, // Show some additional information (note)
  className?: string | Array<Argument>,
  onCloseModal: () => void, // Action that works when we click to close
  clickSubmit?: () => void, // Action that works after click to submit button
};

// Props for derived modals
export type ModalProps = {
  onCloseModal: () => void,
};

const Modal = (props: Props) => {
  const {
    title,
    children,
    onCloseModal,
    warning = false,
    bigSize,
    note,
    renderFooter,
    styleButton = 'primary',
    buttonTitle,
    clickSubmit,
    disabled,
    className,
    ...rest
  } = props;

  return (
    <ReactModal
      {...rest}
      isOpen
      onRequestClose={onCloseModal}
      ariaHideApp={false}
      className={classNames('Modal__content', {
        'Modal__content--big': bigSize,
        className,
      })}
      overlayClassName="Modal__overlay"
    >
      <div className="Modal__inner">
        <div className={classNames('Modal__header', {
          'Modal__header--warning': warning,
        })}
        >
          <div className="Modal__title">
            {title}
          </div>

          <CloseIcon className="Modal__close-button" onClick={onCloseModal} />
        </div>

        <div className="Modal__body">
          {children}
        </div>

        <Choose>
          <When condition={!renderFooter}>
            <div className="Modal__footer">
              <If condition={!!note}>
                <div className="Modal__footer-note">
                  {note}
                </div>
              </If>

              <Button
                data-testid="Modal-cancelButton"
                className="Modal__cancelButton"
                onClick={onCloseModal}
                tertiary
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                type="submit"
                primary={styleButton === 'primary'}
                secondary={styleButton === 'secondary'}
                danger={styleButton === 'danger'}
                success={styleButton === 'success'}
                disabled={disabled}
                onClick={clickSubmit}
                data-testid="Modal-submitButton"
              >
                {buttonTitle}
              </Button>
            </div>
          </When>

          <Otherwise>
            <div className="Modal__footer">
              {renderFooter}
            </div>
          </Otherwise>
        </Choose>
      </div>
    </ReactModal>
  );
};

export default React.memo(Modal);
