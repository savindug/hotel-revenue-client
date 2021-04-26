import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ClusteredData } from './components/ClusteredData';
import MiniDrawer from './components/UI/layout/sideDrawer';
import { makeStyles, Typography } from '@material-ui/core';
import { Dashboard } from './components/UI/Dashboard';
import { HotelDataset } from './components/HotelDataset';
import { Graphs } from './components/Graphs';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    color: 'f4f4f4',
  },
  toolbar: {
    color: '#f4f4f4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Router>
      <div className={classes.root}>
        <MiniDrawer />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route exact path="/" component={Dashboard} />
            {/* <Route path="/login" component={Login} /> */}
            {/* <Route path="/clusters" component={ClusteredData} /> */}
            {/* <Route path="/register" component={Register} /> */}
            {/*  <Route path="/hotels" component={HotelDataset} />
            <Route path="/graphs" component={Graphs} /> */}
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
