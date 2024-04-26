import { ReactNode } from 'react';
export { MultiChainPaymentUI };

export interface MultiChainPaymentUIProps {
  children: ReactNode;
}

// eslint-disable-next-line react/prop-types
const MultiChainPaymentUI = ({children}: MultiChainPaymentUIProps) => {

  return (
    <div>
      {children}
    </div>
  );
}
