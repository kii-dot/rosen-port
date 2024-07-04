import Modal from './ModalBase';
import { H3, H4 } from '../Texts';

interface ConfirmationModalProps {
  open: boolean;
  setOpen: (boolean: boolean) => void;
  onConfirmClicked: React.MouseEventHandler;
}

export const ConfirmationModal = ({ open, setOpen, onConfirmClicked }: ConfirmationModalProps) => {
  return (
    <Modal title={'Connect Wallet'} open={open} setOpen={setOpen}>
      <div>
        <div>
          <H3 className="sm:mt-8 sm:mb-2">Confirmation Modal</H3>
        </div>
        <div>
          <button onClick={onConfirmClicked}>Confirm</button>
        </div>
      </div>
    </Modal>
  );
};
