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
import Profile from './components/Dashboard/Profile';
import Footer from './components/UI/layout/Footer';
import { useEffect } from 'react';
import { searchDestination } from './services/apiServices';

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
    padding: theme.spacing(0, 0.5),
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

  // useEffect(() => {
  //   const regex = /(<([^>]+)>)/gi;
  //   searchDestination().then((res) => {
  //     res.map((e) => (e.caption = e.caption.replace(regex, '')));
  //     console.log(res);
  //   });
  // }, []);

  return (
    <Router>
      <div className={classes.root + ' mb-5'}>
        <MiniDrawer />
        <main className={classes.content}>
          <div className="mb-5" />
          <Switch>
            <PrivateRoute exact path="/" component={ClusteredData} />
            <PrivateRoute path="/dashboard" component={Profile} />
            <Route path="/login" component={Login} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/register" component={Register} />
            {/* <Route path="/profile" component={UserProfile} /> */}
          </Switch>
        </main>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
