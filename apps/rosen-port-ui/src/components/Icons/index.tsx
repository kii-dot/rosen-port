import questionMarkSolid from '#/assets/genericIcon/questionMarkSolid.svg';
import blockSearch from '#/assets/genericIcon/blockSearch.svg';

interface IconProps {
  className?: string;
}
export function QuestionMarkSolid({ className }: IconProps) {
  return <img src={questionMarkSolid} alt="" className={className} />;
}

export function BlockSearch({ className }: IconProps) {
  return <img src={blockSearch} alt="" className={className} />;
}
