import questionMarkSolid from '#/assets/genericIcon/questionMarkSolid.svg';

interface IconProps {
  className?: string;
}
export function QuestionMarkSolid({ className }: IconProps) {
  return <img src={questionMarkSolid} alt="" className={className} />;
}

export { questionMarkSolid };
