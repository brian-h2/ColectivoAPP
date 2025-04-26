import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [region, setRegion] = useState<Region | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permiso de ubicacion degenegado');
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        console.log('Ubicación obtenida:', loc);

        setLocation(loc);
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setLoading(false);
      })(); //Esto permite la ejecucion del async
    }, [])

    const colectivosSimulados = [
      { id: 1, lat: -34.6037, lng: -58.3816 }, // Obelisco
      { id: 2, lat: -34.6091, lng: -58.3923 }, // Congreso
      { id: 3, lat: -34.6012, lng: -58.3841 }, // Teatro Colón
    ];

    if (loading || !region) {
      return (
        <View  style={styles.centered}>
            <ActivityIndicator size="large" color="#42w87f5"/>
        </View>
      )
    }

    return (
      <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation>
        {colectivosSimulados.map(colectivo => (
          <Marker
            key={colectivo.id}
            coordinate={{ latitude: colectivo.lat, longitude: colectivo.lng }}
            title={`Colectivo ${colectivo.id}`}
            pinColor="blue"
          />
        ))}
      </MapView>
    </View>
    )




}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
