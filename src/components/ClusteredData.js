import { CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClusterData } from '../redux/actions/cluster.actions';
import { ClusterAttribs } from './ClusterAtribs';
import DataTable from './DataTable';

export const ClusteredData = () => {
  const dispatch = useDispatch();
  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const { clusterData, loading, err } = getClusterDataSet;
  const [cl1, setCl1] = useState({});
  const [cl2, setCl2] = useState({});
  const [cl3, setCl3] = useState({});
  const [cl4, setCl4] = useState({});

  useEffect(() => {
    dispatch(fetchClusterData('1447930', '2021-03-12'));

    if (clusterData.length > 0 && !loading && !err) {
      clusterData.map((e) => {
        if (e.index === 0) {
          setCl1(e);
        }
        if (e.index === 1) {
          setCl2(e);
        }
        if (e.index === 2) {
          setCl3(e);
        }
        if (e.index === 3) {
          setCl4(e);
        }
      });
    }
  }, [dispatch]);

  return (
    <div>
      <h1>Clustered Data Viewer</h1>
      {loading ? (
        <div className="my-5 mx-auto">
          <CircularProgress />
        </div>
      ) : err ? (
        <Alert severity="error">{err}</Alert>
      ) : (
        clusterData
          .sort((a, b) => b.index - a.index)
          .map(
            (e, i) => (
              console.log(e.index, e.min, e.max, e.mean, e.median),
              (<DataTable cluster={e} />)
              // <ClusterAttribs
              //   index={e.index}
              //   min={e.min}
              //   max={e.max}
              //   mean={e.mean}
              //   median={e.median}
              // />
            )
          )
      )}
    </div>
  );
};
