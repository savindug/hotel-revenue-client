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
import { Link } from 'react-router-dom';

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

export default function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
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
        </Toolbar>
      </AppBar>
      <Drawer
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
        <Divider variant="inset" />
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
        <Divider variant="inset" />
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
        <Divider variant="inset" />
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
        <Divider variant="inset" />
      </Drawer>
    </div>
  );
}
