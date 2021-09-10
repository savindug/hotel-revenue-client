import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ClusteredData } from './components/ClusteredData';
import MiniDrawer from './components/UI/layout/sideDrawer';
import { makeStyles } from '@material-ui/core';
import { Login } from './components/auth/Login';
import PrivateRoute from './routes/PrivateRoute';
import { ResetPassword } from './components/auth/ResetPassword';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { UserProfile } from './components/auth/UserProfile';
import { FONT_FAMILY } from './utils/const';
import { Register } from './components/auth/Register';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    color: 'f4f4f4',
    background: 'white',
    fontFamily: FONT_FAMILY,
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
    background: 'white',
    fontFamily: 'Calibri',
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
            <PrivateRoute exact path="/" component={ClusteredData} />
            <PrivateRoute path="/profile" component={UserProfile} />
            <Route path="/login" component={Login} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/register" component={Register} />
            {/*  <Route path="/hotels" component={HotelDataset} />
            <Route path="/graphs" component={Graphs} /> */}
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
