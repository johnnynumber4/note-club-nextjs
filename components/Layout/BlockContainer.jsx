import React from 'react';
import styles from './BlockContainer.module.css';

export const BlockContainer = ({ children }) => {
  return <div className={styles.blockContainer}>{children}</div>;
};
