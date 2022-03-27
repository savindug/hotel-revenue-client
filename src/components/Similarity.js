import { makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FONT_FAMILY } from '../utils/const';
import SimilarityScore from './SimilarityScore';
import SimilarityScoreWe from './SimilarityScoreWe';
import { EuclidianDistance } from './EuclidianDistance';
import { HotelsPlot } from './HotelsPlot';

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
    reqHotel,
  } = getClusterDataSet;

  const TabularNav = () => {
    const [tabularNavCls] = useState(
      'text-light border-bottom-0 border-secondary  ' + classes.tabularNavStyle
    );
    return (
      <div style={{ position: 'sticky', top: 185, zIndex: 200 }}>
        {' '}
        <Nav variant="tabs" justify="space-around">
          <Nav.Item>
            <Nav.Link
              className={
                tab === 1
                  ? tabularNavCls
                  : 'text-dark font-weight-bold bg-light  shadow '
              }
              eventKey="link-1"
              onClick={() => setTab(1)}
            >
              Similarity - Weekdays
            </Nav.Link>
          </Nav.Item>{' '}
          <Nav.Item>
            <Nav.Link
              className={
                tab === 2
                  ? tabularNavCls
                  : 'text-dark font-weight-bold bg-light  shadow '
              }
              eventKey="link-1"
              onClick={() => setTab(2)}
            >
              Similarity - Weekends
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    );
  };

  return (
    <>
      <TabularNav />
      {hotels.length > 0 && tab === 1 ? (
        <SimilarityScore selectedDate={selectedDate} />
      ) : hotels.length > 0 && tab === 2 ? (
        <SimilarityScoreWe selectedDate={selectedDate} />
      ) : hotels.length > 0 && tab === -1 ? (
        <EuclidianDistance selectedDate={selectedDate} />
      ) : hotels.length > 0 && tab === 3 ? (
        <HotelsPlot hotels={hotels} />
      ) : (
        <></>
      )}
    </>
  );
};
