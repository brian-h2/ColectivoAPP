import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [region, setRegion] = useState<Region | null>(null);
    const [loading, setLoading] = useState(true);
    const [colectivos, setColectivos] = useState([])

    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se necesita la ubicación para mostrar el mapa.');
          return;
        }
  
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setLoading(false);
      })();
  
      const fetchColectivos = async () => {
        try {
          const res = await fetch('https://tu-backend.onrender.com/colectivos');
          const data = await res.json();
          setColectivos(data);
          console.log(data)
        } catch (err) {
          console.error('Error al traer colectivos:', err);
        }
      };
  
      fetchColectivos();
      const interval = setInterval(fetchColectivos, 5000); // Cada 5s
      return () => clearInterval(interval);
    }, []);


    if (loading || !region) {
      return (
        <View  style={styles.centered}>
            <ActivityIndicator size="large" color="#42w87f5"/>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <MapView style={{ flex: 1 }} region={region}>
          {colectivos.map(colectivo => (
          <Marker
            key={colectivo.id}
            coordinate={{ latitude: colectivo.lat, longitude: colectivo.lng }}
            title={`Colectivo ${colectivo.id}`}
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
