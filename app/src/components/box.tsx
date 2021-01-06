import React from 'react';
import style from './box.module.scss';

interface BoxProps {}

const Box: React.FunctionComponent<BoxProps> = ({ children }) => {
  return <div className={style.box}>{children}</div>;
};

export default Box;