import classNames from 'classnames';

interface TextProps {
  children: string;
  className: string;
}

export const H1 = ({ children = '', className = '' }) => {
  return <div className={classNames(className, 'text-2xl text-white')}>{children}</div>;
};

export const H2 = ({ children = '', className = '' }) => {
  return <div className={classNames(className, 'text-xl text-white')}>{children}</div>;
};

export const H3 = ({ children = '', className = '' }) => {
  return <div className={classNames(className, 'text-lg text-white')}>{children}</div>;
};

export const H4 = ({ children = '', className = '' }) => {
  return <div className={classNames(className, 'text-md text-white')}>{children}</div>;
};
