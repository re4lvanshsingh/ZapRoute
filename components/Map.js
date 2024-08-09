import { StyleSheet, Text, View, SafeAreaView, Animated, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'
import tw from 'twrnc'
import { useSelector } from 'react-redux'
import { selectVisitOrder } from "../slices/navSlice.js"
import MapViewDirections from 'react-native-maps-directions'
import { GOOGLE_MAPS_APIKEY } from '@env'

const Map = () => {
    const tsp = useSelector(selectVisitOrder);
    console.log(tsp);

    const tspPairs = [];
    for (let i = 0; i < tsp.length - 1; i++) {
        const current = tsp[i];
        const next = tsp[i + 1];
        tspPairs.push({ current, next });
    }

    const mapRef = useRef(null);
    const [region, setRegion] = useState({
        latitude: tsp[0].latitude,
        longitude: tsp[0].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    useEffect(() => {
        if (tsp.length > 0) {
            let originlat = tsp[0].latitude;
            let originlong = tsp[0].longitude;

            let destinationlat = tsp[0].latitude;
            let destinationlong = tsp[0].longitude;

            for (let i = 0; i < tsp.length; i++) {
                if (tsp[i].latitude > originlat) {
                    originlat = tsp[i].latitude;
                }

                if (tsp[i].latitude < destinationlat) {
                    destinationlat = tsp[i].latitude;
                }

                if (tsp[i].longitude > originlong) {
                    originlong = tsp[i].longitude;
                }

                if (tsp[i].longitude < destinationlong) {
                    destinationlong = tsp[i].longitude;
                }
            }

            const newRegion = {
                latitude: (originlat + destinationlat) / 2,
                longitude: (originlong + destinationlong) / 2,
                latitudeDelta: Math.abs(originlat - destinationlat) * 1.2,
                longitudeDelta: Math.abs(originlong - destinationlong) * 1.2,
            };

            setRegion(newRegion);
            mapRef.current.animateToRegion(newRegion);
        }
    }, [tsp]);

    const zoomIn = () => {
        setRegion(prevRegion => ({
            ...prevRegion,
            latitudeDelta: prevRegion.latitudeDelta / 2,
            longitudeDelta: prevRegion.longitudeDelta / 2,
        }));
        mapRef.current.animateToRegion({
            ...region,
            latitudeDelta: region.latitudeDelta / 2,
            longitudeDelta: region.longitudeDelta / 2,
        });
    };

    const zoomOut = () => {
        setRegion(prevRegion => ({
            ...prevRegion,
            latitudeDelta: prevRegion.latitudeDelta * 2,
            longitudeDelta: prevRegion.longitudeDelta * 2,
        }));
        mapRef.current.animateToRegion({
            ...region,
            latitudeDelta: region.latitudeDelta * 2,
            longitudeDelta: region.longitudeDelta * 2,
        });
    };

    return (
        <View style={tw`flex-1`}>
            <MapView
                ref={mapRef}
                style={tw`flex-1`}
                mapType='mutedStandard'
                initialRegion={region}
                showsUserLocation={true}
                onRegionChangeComplete={(region) => setRegion(region)}
            >
                {tspPairs.map(({ current, next }) => {
                    const { id: currentId, latitude: currentLat, longitude: currentLong, text: currentText } = current;
                    const { latitude: nextLat, longitude: nextLong } = next;

                    return (
                        <React.Fragment key={currentId}>
                            <MapViewDirections
                                origin={{ latitude: currentLat, longitude: currentLong }}
                                destination={{ latitude: nextLat, longitude: nextLong }}
                                apikey={GOOGLE_MAPS_APIKEY}
                                strokeColor='black'
                                strokeWidth={3}
                            />
                        </React.Fragment>
                    );
                })}

                {tsp.map(({ id, latitude, longitude, text, color }) => (
                    <Marker
                        key={id}
                        coordinate={{
                            latitude: latitude,
                            longitude: longitude,
                        }}
                        title='Destination'
                        description={text}
                        identifier='destination'
                        pinColor={color}
                    />
                ))}
            </MapView>

            <View style={styles.zoomControls}>
                <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
                    <Text style={styles.zoomText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
                    <Text style={styles.zoomText}>-</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    zoomControls: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'column',
    },
    zoomButton: {
        width: 40,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 5,
        elevation: 5,
    },
    zoomText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Map;
