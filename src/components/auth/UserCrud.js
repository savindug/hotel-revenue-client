import React, { useState, useEffect } from 'react';
import { Badge, Container, FormLabel } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  FormControl,
  FormGroup,
  InputLabel,
  makeStyles,
  Select,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import { fetchHotelsList } from '../../redux/actions/cluster.actions';
import { configUser } from '../../services/auth.service';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export const UserCrud = ({ setformNotification }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const { loading, err, hotelList, markets } = getClusterDataSet;

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const [selectedProperty, setSelectedProperty] = useState(
    user !== undefined && user !== null
      ? user.application.properties.length > 0
        ? user.application.candidate_properties
        : []
      : []
  );
  const [selectedPropertyIndx, setSelectedPropertyIndx] = useState(0);
  const [selectedMarket, setSelectedMarket] = useState();
  const [selectedMarketIndx, setSelectedMarketIndx] = useState();

  const [formEditale, setFormEditale] = useState(false);

  const handleMarketChange = (event) => {
    if (event.target.value >= 0) {
      const newMarket = event.target.value;
      setSelectedMarket(newMarket);
      setSelectedMarketIndx(event.target.value);
    }
  };

  const handlePropertyChange = (event) => {
    const newHotel = hotelList[event.target.value];
    setSelectedPropertyIndx(event.target.value);
    if (selectedProperty.length > 0) {
      let isAvailable = selectedProperty.find((e) => e.id === newHotel.id);

      if (isAvailable === undefined) {
        setSelectedProperty((arr) => [...arr, newHotel]);
      } else {
      }
    } else {
      setSelectedProperty((arr) => [...arr, newHotel]);
    }
  };

  const removeSelectedProperty = (id) => {
    let updatedArr = [...selectedProperty];

    updatedArr = updatedArr.filter(function (item) {
      return item.id !== id;
    });
    setSelectedProperty(updatedArr);
  };

  const handleConfigureSubmit = async (e) => {
    e.preventDefault();
    await configUser(user._id, selectedProperty).then((res) => {
      setformNotification({
        text: `Your Hotels filter updated.`,
        varient: 'success',
      });
      setFormEditale(!formEditale);
    });
  };

  const cancelForm = async (e) => {
    e.preventDefault();
    setFormEditale(!formEditale);
  };

  useEffect(() => {
    async function getHotelList() {
      await dispatch(fetchHotelsList(selectedMarket));
    }
    if (selectedMarket !== undefined) {
      getHotelList();
    }
  }, [dispatch, selectedMarket]);

  return (
    <Container>
      <Form onSubmit={handleConfigureSubmit}>
        <FormGroup className={classes.formControl}>
          {formEditale ? (
            <>
              <FormLabel htmlFor="grouped-native-select">
                Select Destinations
              </FormLabel>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="grouped-native-select">
                  Destination
                </InputLabel>
                <Select
                  native
                  id="grouped-native-select"
                  onChange={handleMarketChange}
                  value={selectedMarketIndx}
                >
                  <option value={-100}>None</option>
                  {(() => {
                    if (markets.length > 0) {
                      if (user.role === 'admin' || user.role === 'manager') {
                        return markets.map((d, index) => (
                          <option value={d.id}>&nbsp;{d.name}&nbsp;</option>
                        ));
                      } else {
                        if (user.application.destinations.length > 0) {
                          const allowedMatrkets =
                            user.application.destinations.filter(
                              ({ id: id1 }) =>
                                markets.some(({ id: id2 }) => id2 === id1)
                            );
                          return allowedMatrkets.length > 0 ? (
                            allowedMatrkets.map((d, index) => (
                              <option value={d.id}>&nbsp;{d.name}&nbsp;</option>
                            ))
                          ) : (
                            <></>
                          );
                        }
                      }
                    }
                  })()}
                </Select>
              </FormControl>
              <FormLabel htmlFor="grouped-native-select" className="my-3">
                Select Properties
              </FormLabel>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="grouped-native-select">Hotel</InputLabel>
                <Select
                  native
                  id="grouped-native-select"
                  onChange={handlePropertyChange}
                  value={selectedPropertyIndx}
                >
                  {hotelList.length > 0 ? (
                    hotelList.map((h, index) => {
                      return (
                        <option value={index}>&nbsp;{h.name}&nbsp;</option>
                      );
                    })
                  ) : (
                    <option value={-100}>None</option>
                  )}
                </Select>
              </FormControl>
            </>
          ) : (
            <></>
          )}

          <FormLabel className="mt-5" htmlFor="grouped-native-select">
            Selected Properties
          </FormLabel>
          <Box component="span" m={1}>
            {selectedProperty.length > 0 ? (
              (selectedProperty.length + ' Properties',
              selectedProperty.map((h, ind) => (
                <Badge variant="secondary" className="m-1 pe-auto">
                  <span>
                    {formEditale ? (
                      <>
                        <>{h.name} &nbsp;</>
                        <i
                          class="fas fa-times-circle"
                          onClick={() => removeSelectedProperty(h.id)}
                        ></i>
                      </>
                    ) : (
                      <h6>{h.name} &nbsp;</h6>
                    )}
                  </span>
                </Badge>
              )))
            ) : (
              <>No Selected Properties </>
            )}
          </Box>

          {formEditale ? (
            <>
              <Button
                variant="primary"
                type="submit"
                className={'btn btn-md btn-primary mt-5'}
              >
                Submit
              </Button>
              <Button
                variant="secondary"
                className={'btn btn-md btn-secondary my-1'}
                onClick={cancelForm}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              type="button"
              className={'btn btn-md btn-primary mt-5'}
              onClick={() => {
                setFormEditale(!formEditale);
              }}
            >
              Edit
            </Button>
          )}
        </FormGroup>
      </Form>
      {/* {!formEditale ? (
        <Button
          variant="primary"
          type="button"
          className={'btn btn-md btn-primary mt-5'}
          onClick={() => {
            setFormEditale(!formEditale);
          }}
        >
          Edit
        </Button>
      ) : (
        <></>
      )} */}
    </Container>
  );
};
