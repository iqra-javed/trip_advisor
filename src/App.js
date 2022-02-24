import React, { useEffect, useState, useMemo } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData } from './api';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

export default function App() {
  const [places, setPlaces] = useState([]);
  const [childClicked, setChildClicked] = useState(null);
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  useEffect(() => {
    async function getAndSetPlacesOnLocalState() {
      const data = await getPlacesData(type, bounds.sw, bounds.ne);

      setPlaces(data);
      setRating(0)
      setIsLoading(false);
    }

    setIsLoading(true);
    getAndSetPlacesOnLocalState();
  }, [coordinates, bounds, type]);

  let filteredPlaces = [...places];
  useMemo(() => {
    filteredPlaces = places.filter((place) => place.rating > rating);
  }, [rating])

  return (
    <>
      <CssBaseline />
      <Header />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filteredPlaces}
            setChildClicked={setChildClicked}
          />
        </Grid>
      </Grid>
    </>
  );
}
