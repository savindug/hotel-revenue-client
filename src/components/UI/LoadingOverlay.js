import React from 'react';
import styles from '../../styles/loadingOverlay.module.css';
export const LoadingOverlay = ({ show }) => {
  return (
    <div class={styles.wrapper}>
      <div class={styles.overlay + show ? (styles.show = true) : ''}></div>
      <div class={styles.spanner + show ? (styles.show = true) : ''}>
        <div class={styles.loader}>
          <h1>Fetching Data</h1>
        </div>
      </div>
    </div>
  );
};
