import { IToken } from '#/types/chains';
import Modal from './ModalBase';
import { H3, H4 } from '../Texts';

interface TokenModalProps {
  open: boolean;
  setOpen: (boolean: boolean) => void;
  onTokenClicked: (token: IToken) => void;
  tokens: Array<IToken>;
}

export const TokenModal = ({ open, setOpen, tokens, onTokenClicked }: TokenModalProps) => {
  return (
    <Modal title={'Connect Wallet'} open={open} setOpen={setOpen}>
      <div>
        <div>
          <H3 className="sm:mt-8 sm:mb-2">Token Modal:</H3>
        </div>
        <div className="text-white flex flex-col text-left items-start">
          {tokens.map((token) => {
            return (
              <button key={token.id} onClick={() => onTokenClicked(token)}>
                {token.name}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
