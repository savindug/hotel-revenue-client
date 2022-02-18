import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FONT_FAMILY } from '../utils/const';
import SimilarityScore from './SimilarityScore';
import SimilarityScoreWe from './SimilarityScoreWe';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  tabularNavStyle: {
    backgroundColor: '#607D8B',
    fontFamily: FONT_FAMILY,
    fontWeight: 'bold',
  },
}));
export const Similarity = ({ selectedDate }) => {
  const classes = useStyles();
  const [tab, setTab] = useState(1);

  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const {
    clusterData,
    loading,
    err,
    cluster1,
    cluster2,
    cluster3,
    cluster4,
    hotels,
    hotelList,
    markets,
    refreshDates,
  } = getClusterDataSet;

  const TabularNav = () => {
    const [tabularNavCls] = useState(
      'text-light border-bottom-0 border-secondary  ' + classes.tabularNavStyle
    );
    return (
      <Nav variant="tabs" justify="space-around">
        <Nav.Item>
          <Nav.Link
            className={tab === 1 ? tabularNavCls : 'text-dark font-weight-bold'}
            eventKey="link-1"
            onClick={() => setTab(1)}
          >
            Similarity - Weekdays
          </Nav.Link>
        </Nav.Item>{' '}
        <Nav.Item>
          <Nav.Link
            className={tab === 2 ? tabularNavCls : 'text-dark font-weight-bold'}
            eventKey="link-1"
            onClick={() => setTab(2)}
          >
            Similarity - Weekends
          </Nav.Link>
        </Nav.Item>
      </Nav>
    );
  };

  return (
    <>
      <TabularNav />
      {hotels.length > 0 && tab === 1 ? (
        <SimilarityScore selectedDate={selectedDate} />
      ) : hotels.length > 0 && tab === 2 ? (
        <SimilarityScoreWe selectedDate={selectedDate} />
      ) : (
        <></>
      )}
    </>
  );
};