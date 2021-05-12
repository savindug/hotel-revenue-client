import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import {
  BarChartOutlined,
  MultilineChartOutlined,
  TableChartOutlined,
} from '@material-ui/icons';
import { Link, Redirect } from 'react-router-dom';
import { Navbar, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logOut } from '../../../redux/actions/auth.actions';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    color: 'f4f4f4',
  },
  appBar: {
    backgroundColor: '#2e2e2e',
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
    backgroundColor: '#2e2e2e',
    color: '#f4f4f4',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    backgroundColor: '#2e2e2e',
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
    padding: theme.spacing(3),
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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogOut = async () => {
    await dispatch(logOut());
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
        {/* <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: true,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            <Link
              to="/"
              variant="body2"
              color="inherit"
              style={{ textDecoration: 'none', color: '#f4f4f4' }}
            >
              {' '}
              Rate Buckets{' '}
            </Link>
          </Typography>
        </Toolbar> */}
        <Navbar className="navbar navbar-expand-lg navbar-inverse">
          <Navbar.Brand href="/" className="text-light">
            Rate Buckets
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="text-light mx-5">
              Signed in as:&nbsp;{' '}
              {isLoggedIn ? <a className="text-light">{user.name}</a> : <></>}
            </Navbar.Text>
            <Button
              variant="outline-light"
              onClick={() => {
                handleLogOut();
              }}
            >
              Logout
            </Button>
          </Navbar.Collapse>
        </Navbar>
      </AppBar>
      {/* <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon
                style={{
                  color: '#f4f4f4',
                }}
              />
            ) : (
              <ChevronLeftIcon
                style={{
                  color: '#f4f4f4',
                }}
              />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {' '}
          <Link
            to="/clusters"
            variant="body2"
            color="inherit"
            style={{ textDecoration: 'none', color: '#f4f4f4' }}
          >
            <ListItem button key="clusters">
              <ListItemIcon
                style={{
                  color: '#f4f4f4',
                }}
              >
                <TableChartOutlined />
              </ListItemIcon>
              {open ? <ListItemText primary="Cluster Reports" /> : <></>}
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          {' '}
          <Link
            to="/clusters"
            variant="body2"
            color="inherit"
            style={{ textDecoration: 'none', color: '#f4f4f4' }}
          >
            <ListItem button key="clusters">
              <ListItemIcon
                style={{
                  color: '#f4f4f4',
                }}
              >
                <BarChartOutlined />
              </ListItemIcon>
              {open ? <ListItemText primary="Analytics Graphs" /> : <></>}
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          {' '}
          <Link
            to="/clusters"
            variant="body2"
            color="inherit"
            style={{ textDecoration: 'none', color: '#f4f4f4' }}
          >
            <ListItem button key="clusters">
              <ListItemIcon
                style={{
                  color: '#f4f4f4',
                }}
              >
                <MultilineChartOutlined />
              </ListItemIcon>
              {open ? <ListItemText primary="RADAR Reports" /> : <></>}
            </ListItem>
          </Link>
        </List>
        <Divider />
      </Drawer>*/}
    </div>
  );
}
