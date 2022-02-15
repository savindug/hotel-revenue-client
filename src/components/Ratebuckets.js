import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FONT_FAMILY } from '../utils/const';
import ClusterDataTable from './ClusterDataTable';

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

export const Ratebuckets = ({ selectedDate }) => {
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
    ratingCluster,
  } = getClusterDataSet;

  const classes = useStyles();
  const [tab, setTab] = useState(1);

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
            All Hotels
          </Nav.Link>
        </Nav.Item>{' '}
        {ratingCluster.clusterData.length > 0 ? (
          <Nav.Item>
            <Nav.Link
              className={
                tab === 2 ? tabularNavCls : 'text-dark font-weight-bold'
              }
              eventKey="link-1"
              onClick={() => setTab(2)}
            >
              Best Rating Hotels
            </Nav.Link>
          </Nav.Item>
        ) : (
          <></>
        )}
      </Nav>
    );
  };

  return (
    <>
      <TabularNav />
      {hotels.length > 0 && tab === 1 && clusterData.length > 0 ? (
        <>
          <div id="stars5" className="my-5">
            <ClusterDataTable
              cluster={cluster4}
              stars={5}
              selectedDate={selectedDate}
            />
          </div>
          <div id="stars4" className="my-5">
            <ClusterDataTable
              cluster={cluster3}
              stars={4}
              selectedDate={selectedDate}
            />
          </div>
          <div id="stars3" className="my-5">
            <ClusterDataTable
              cluster={cluster2}
              stars={3}
              selectedDate={selectedDate}
            />
          </div>
          <div id="stars2" className="my-5">
            <ClusterDataTable
              cluster={cluster1}
              stars={2}
              selectedDate={selectedDate}
            />
          </div>
        </>
      ) : hotels.length > 0 &&
        tab === 2 &&
        ratingCluster.clusterData.length > 0 ? (
        <>
          <div id="stars5" className="my-5">
            <ClusterDataTable
              cluster={ratingCluster.cluster4}
              stars={5}
              selectedDate={selectedDate}
            />
          </div>
          <div id="stars4" className="my-5">
            <ClusterDataTable
              cluster={ratingCluster.cluster3}
              stars={4}
              selectedDate={selectedDate}
            />
          </div>
          <div id="stars3" className="my-5">
            <ClusterDataTable
              cluster={ratingCluster.cluster2}
              stars={3}
              selectedDate={selectedDate}
            />
          </div>
          <div id="stars2" className="my-5">
            <ClusterDataTable
              cluster={ratingCluster.cluster1}
              stars={2}
              selectedDate={selectedDate}
            />
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
