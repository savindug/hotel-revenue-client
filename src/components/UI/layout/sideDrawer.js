import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  Navbar,
  Button,
  OverlayTrigger,
  Overlay,
  Popover,
  Col,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { logOut } from '../../../redux/actions/auth.actions';
import { createImageFromInitials } from '../../../services/auth.service';
import { Grid } from '@material-ui/core';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    color: 'f4f4f4',
  },
  appBar: {
    backgroundColor: '#516B8F',
    color: '#f4f4f4',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    color: '#f4f4f4',
  },
  drawerOpen: {
    backgroundColor: '#516B8F',
    color: '#f4f4f4',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    backgroundColor: '#516B8F',
    color: '#f4f4f4',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
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
    padding: theme.spacing(2),
  },
}));

export default function MiniDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { user, auth_loading, auth_err, isLoggedIn } = auth;
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };

  const handleLogOut = async () => {
    await dispatch(logOut());
    setShow(!show);
    history.push('/');
  };
  return (
    <div>
      <CssBaseline />
      <AppBar
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Navbar className="navbar navbar-expand-lg navbar-inverse">
          <Navbar.Brand href="/" className="text-light mx-auto rb-logo">
            RateBuckets
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {isLoggedIn ? (
              <>
                <img
                  class="rounded-circle img-fluid img-circle d-block"
                  src={createImageFromInitials(40, user.name, '#1A237E')}
                  alt="avatar"
                  onClick={handleClick}
                />
                <Overlay
                  show={show}
                  target={target}
                  placement="bottom"
                  container={ref.current}
                  containerPadding={20}
                >
                  <Popover id="popover-contained">
                    <Popover.Title as="h3" className="text-capitalize">
                      Hello {user.name}
                    </Popover.Title>
                    <Popover.Content>
                      <Link
                        className="text-light mx-auto"
                        to="/dashboard"
                        onClick={() => setShow(!show)}
                      >
                        <Button variant="outline-primary">View Profile</Button>
                      </Link>{' '}
                      <Button
                        variant="outline-danger"
                        onClick={() => {
                          handleLogOut();
                        }}
                      >
                        Logout
                      </Button>
                    </Popover.Content>
                  </Popover>
                </Overlay>
              </>
            ) : (
              <></>
            )}
          </Navbar.Collapse>
        </Navbar>
      </AppBar>
    </div>
  );
}
