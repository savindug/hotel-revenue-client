import { capitalize } from '@material-ui/core';
import moment from 'moment';
import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  createImageFromInitials,
  sendResetEmail,
  getRandomColor,
} from '../../services/auth.service';
import { AlertModel } from '../UI/models/AlertModel';
import { UserCrud } from './UserCrud';

export const UserProfile = () => {
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const [formNotification, setformNotification] = useState({
    text: null,
    varient: null,
  });
  const [formEditale, setFormEditale] = useState(false);

  const history = useHistory();
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
        {/* <div class="form-group row">
          <label class="col-3 col-form-label form-control-label">
            Address
          </label>
          <div class="col-9">
            <input
              class="form-control"
              type="text"
              value=""
              placeholder="Street"
            />
          </div>
        </div>
        <div class="form-group row">
          <label class="col-3 col-form-label form-control-label"></label>
          <div class="col-6">
            <input
              class="form-control"
              type="text"
              value=""
              placeholder="City"
            />
          </div>
          <div class="col-3">
            <input
              class="form-control"
              type="text"
              value=""
              placeholder="State"
            />
          </div>
        </div> */}
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

  return (
    <div class="container">
      <div class="row my-2">
        <div class="col-8 order-lg-2">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a
                href=""
                data-target="#profile"
                data-toggle="tab"
                class="nav-link active"
              >
                Profile
              </a>
            </li>
            <li class="nav-item">
              <a
                href=""
                data-target="#messages"
                data-toggle="tab"
                class="nav-link"
              >
                Notification Center
              </a>
            </li>
            <li class="nav-item">
              <a href="" data-target="#edit" data-toggle="tab" class="nav-link">
                Manage RADAR
              </a>
            </li>
          </ul>
          <div class="tab-content py-4">
            {formNotification.text !== null &&
            formNotification.varient !== null ? (
              <AlertModel
                text={formNotification.text}
                varient={formNotification.varient}
              />
            ) : (
              <></>
            )}
            <div class="tab-pane active" id="profile">
              <h5 class="mb-3 text-center">User Profile</h5>
              <UserDetailsForm />
            </div>
            <div class="tab-pane" id="messages"></div>
            <div class="tab-pane" id="edit">
              <h5 class="mb-3 text-center">Hotels Filter</h5>
              <UserCrud setformNotification={setformNotification} />
            </div>
          </div>
        </div>
        <div class="col-4 order-lg-1 text-center">
          <img
            class="profileImage mx-auto img-fluid img-circle d-block"
            src={createImageFromInitials(500, user.name, '#1A237E')}
            alt="avatar"
          />
        </div>
      </div>
    </div>
  );
};
