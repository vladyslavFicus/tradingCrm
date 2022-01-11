export interface Modal<TProps = {}> {
  show: (props?: TProps) => void;
  hide: () => void;
}

export interface ConfirmationModal extends Modal {
  uuid?: string;
  fullName?: string;
  actionText?: string;
  modalTitle?: string;
  additionalText?: string;
  isOpen: boolean;
  submitButtonLabel?: string;
  cancelButtonLabel?: string;
  onSubmit: () => void;
  onCloseModal: () => void;
  onCloseCallback?: () => void;
  className?: string;
}
