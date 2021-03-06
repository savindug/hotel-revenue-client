import React from 'react';
import styles from '../../styles/loadingOverlay.module.css';
export const LoadingOverlay = ({ show }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay + show ? styles.show : ''}></div>
      <div className={styles.spanner + show ? styles.show : ''}>
        <div className={styles.loader}>
          <h1>Fetching Data</h1>
        </div>
      </div>
    </div>
  );
};
