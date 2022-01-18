import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import moment from 'moment';
import { sendResetEmail } from '../../services/auth.service';
import { UserProfile } from '../auth/UserProfile';
import { AlertModel } from '../UI/models/AlertModel';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AppSettingsAltOutlinedIcon from '@mui/icons-material/AppSettingsAltOutlined';
import { UserCrud } from '../auth/UserCrud';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import { Billing } from './Billing';

const drawerWidth = window.innerWidth / 8;

export default function Profile() {
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const [formNotification, setformNotification] = useState({
    text: null,
    varient: null,
  });
  const [formEditale, setFormEditale] = useState(false);

  const [selectedSection, setSelectedSection] = useState(0);

  const [sectionTitle, setSectionTitle] = useState('Account Details');

  const UserDetailsForm = () => {
    return (
      <form role="form">
        <div class="form-group row">
          <label class="col-3 col-form-label form-control-label">Name</label>
          <div class="col-9">
            <input
              class="form-control"
              type="text"
              value={user.name}
              disabled={formEditale ? false : true}
            />
          </div>
        </div>
        <div class="form-group row">
          <label class="col-3 col-form-label form-control-label">Email</label>
          <div class="col-9">
            <input
              class="form-control"
              type="email"
              value={user.email}
              disabled={formEditale ? false : true}
            />
          </div>
        </div>
        <div class="form-group row">
          <label class="col-3 col-form-label form-control-label">
            Time Zone
          </label>
          <div class="col-9">
            <select class="form-control" size="0" disabled={true}>
              <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </option>
            </select>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-3 col-form-label form-control-label">
            Account Type
          </label>
          <div class="col-9">
            <input
              class="form-control"
              style={{ textTransform: 'capitalize' }}
              type="text"
              value={user.role}
              disabled={true}
            />
          </div>
        </div>
        <div class="form-group row">
          <label class="col-3 col-form-label form-control-label">
            Member Since
          </label>
          <div class="col-9">
            <input
              class="form-control"
              style={{ textTransform: 'capitalize' }}
              type="text"
              value={moment(user.date).format('YYYY-MM-DD')}
              disabled={true}
            />
          </div>
        </div>
        <div class="form-group row">
          <label class="col-3 col-form-label form-control-label">
            Password
          </label>
          <div class="col-6">
            <input
              class="form-control"
              type="password"
              value="11111122333"
              disabled={true}
            />
          </div>
          <div class="col-3">
            <input
              type="button"
              class="btn  btn-outline-warning"
              value="Reset"
              onClick={async () => {
                await sendResetEmail(user.email).then((res) => {
                  setformNotification({
                    text: `Your password reset link has sent to the ${res.email}.\nPlease follow the link to reset password.`,
                    varient: 'success',
                  });
                });
              }}
            />
          </div>
        </div>
      </form>
    );
  };

  const handleMenuChange = (index) => {
    setSelectedSection(index);
    if (index === 0) {
      setSectionTitle('Account Details');
    } else if (index === 1) {
      setSectionTitle('Configure Analysis Set');
    } else if (index === 2) {
      setSectionTitle('Billing Console');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#EEEEEE',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                bgcolor: '#EEEEEE',
                borderRadius: 1,
              }}
            >
              {['Account Details', 'Manage Radar', 'Billing Console'].map(
                (text, index) => (
                  <>
                    <ListItem
                      className="my-5"
                      button
                      key={text}
                      onClick={() => handleMenuChange(index)}
                    >
                      <ListItemIcon>
                        {index === 0 ? (
                          <AccountCircleOutlinedIcon />
                        ) : index === 1 ? (
                          <AppSettingsAltOutlinedIcon />
                        ) : index === 2 ? (
                          <MonetizationOnOutlinedIcon />
                        ) : (
                          <MailIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItem>
                    <Divider />
                  </>
                )
              )}
            </Box>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        className="mx-5"
        sx={{ flexGrow: 1, p: 5, overflow: 'auto' }}
      >
        {/* <Toolbar /> */}
        {formNotification.text !== null && formNotification.varient !== null ? (
          <AlertModel
            text={formNotification.text}
            varient={formNotification.varient}
          />
        ) : (
          <></>
        )}

        <h1>{sectionTitle}</h1>
        <Divider className="mb-5" />
        {selectedSection === 0 ? (
          <UserDetailsForm />
        ) : selectedSection === 1 ? (
          <UserCrud setformNotification={setformNotification} />
        ) : selectedSection === 2 ? (
          <Billing />
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
}
