import Modal from './ModalBase';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { H3, H4 } from '../Texts';
import { KYA } from '#/constants/confirmationModal';
import { BatchUI } from '../Batch/BatchUI';

interface ConfirmationModalProps {
  open: boolean;
  setOpen: (boolean: boolean) => void;
  onConfirmClicked: React.MouseEventHandler;
}

export const ConfirmationModal = ({ open, setOpen, onConfirmClicked }: ConfirmationModalProps) => {
  return (
    <Modal title={'Initiate Bridge Transfer'} open={open} setOpen={setOpen}>
      <div className="flex flex-col">
        {/* Bridge Graphics */}
        <div>
          <H3 className="sm:mt-8 sm:mb-2">Confirmation Modal</H3>
        </div>
        {/* Current batch Status*/}
        <BatchUI capacityFilledAmount={1000} thresholdAmount={2000} addingAmount={200} />
        {/* KYA */}
        <div className="text-white">
          <div className="">{KYA.title}</div>
          <ul className="font-thin list-disc text-sm px-5">
            <li className="py-2">
              Your funds will be added to a batch and then transferred when the batch{' '}
              <span className="text-emerald">reaches the minimum $2000 threshold</span>.
            </li>
            <li className="pb-2">
              You can withdraw your funds from the &quot;<span className="text-emerald">Transaction History</span>
              &quot; page at anytime before a batch reaches the threshold but you have to pay a{' '}
              <span className="text-emerald">0.5 ERG fee</span> for withdrawing.
            </li>
            <li className="pb-2">
              You will automatically receive your funds once the bridge transfer has been done.{' '}
              <span className="text-emerald">No claiming is required</span>.
            </li>
          </ul>
        </div>
        {/* Initiate */}
        <div className="flex mt-4">
          <button
            className="bg-teal-900 text-emerald w-full rounded-lg py-3 hover:bg-teal-400 hover:text-gray-900 active:bg-teal-600 active:text-gray-800 flex justify-center items-center"
            onClick={onConfirmClicked}
          >
            Confirm and Initiate Bridge
            <ArrowRightCircleIcon className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
