import { usePageContext } from '../context/usePageContext';
import PropTypes from 'prop-types';

export { Link };

Link.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string.isRequired,
  isActiveClassName: PropTypes.string,
  children: PropTypes.node,
};

function Link(props) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const { href } = props;
  const isActive = href === '/' ? urlPathname === href : urlPathname.startsWith(`/${href}`);
  const className = [props.className, isActive && props.isActiveClassName].filter(Boolean).join(' ');
  console.log(className);
  return (
    <a className={className} href={props.href}>
      {props.children}
    </a>
  );
}

Link.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export function RosenPortLink(props) {
  return (
    <Link href={props.href} className={props.className} isActiveClassName={'text-teal-500'}>
      {props.children}
    </Link>
  );
}
