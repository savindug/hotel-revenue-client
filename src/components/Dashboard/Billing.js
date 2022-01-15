import { Card } from '@material-ui/core';
import {
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import React from 'react';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import { Box } from '@mui/system';
import { ListGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';

export const Billing = () => {
  const auth = useSelector((state) => state.auth);
  const { user, reports } = auth;

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <Card>
              <CardActionArea>
                <CardContent>
                  <div class="page-header">
                    <div class="float-left">
                      <Typography gutterBottom variant="h5">
                        Subscription Plan{' '}
                      </Typography>
                    </div>
                    <div class="float-right">
                      <button className="btn btn-sm  btn-outline-primary">
                        Update
                      </button>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                  <Divider className="my-2" />
                  <Typography variant="body2" color="text.secondary">
                    <div class="page-header">
                      <div class="float-left">
                        <span class="badge badge-pill badge-success py-1">
                          Standard
                        </span>
                      </div>
                      <div class="float-right ">
                        <span className="text-dark font-weight-normal py-1">
                          {' '}
                          Property Subscription
                        </span>
                      </div>
                      <div class="clearfix"></div>
                      <br />
                      <div className="text-dark font-weight-normal my-1">
                        {' '}
                        Monthly Billing for subscribed properties{' '}
                      </div>
                    </div>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
          <div className="col-md-2"></div>
          <div className="col-md-6">
            <Card>
              <CardActionArea>
                <CardContent>
                  <div class="page-header">
                    <div class="float-left">
                      <Typography gutterBottom variant="h5">
                        Property Subscriptions{' '}
                      </Typography>
                    </div>
                    <div class="float-right">
                      <button className="btn btn-sm  btn-outline-primary">
                        Update
                      </button>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                  <Divider className="my-2" />
                  <ListGroup as="ol" numbered>
                    {user.application.properties.length > 0 ? (
                      user.application.properties.map((prop, index) => (
                        <ListGroup.Item as="li">
                          <span>{prop.name}</span>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <></>
                    )}
                  </ListGroup>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
