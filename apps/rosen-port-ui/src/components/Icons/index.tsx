import questionMarkSolid from '#/assets/genericIcon/questionMarkSolid.svg';
import blockSearch from '#/assets/genericIcon/blockSearch.svg';
import logout from '#/assets/genericIcon/logout.svg';

interface IconProps {
  className?: string;
}
export function QuestionMarkSolid({ className }: IconProps) {
  return <img src={questionMarkSolid} alt="" className={className} />;
}

export function BlockSearch({ className }: IconProps) {
  return <img src={blockSearch} alt="" className={className} />;
}

export function LogOut({ className }: IconProps) {
  return <img src={logout} alt="" className={className} />;
}

export * from './Wallet';
