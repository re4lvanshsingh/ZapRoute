import { StyleSheet, Text, View, Button, SafeAreaView,Animated, TouchableOpacity } from 'react-native'
import React, { useEffect,useRef,useState } from 'react'
import { BottomSheet, BottomSheetFlatList } from '@gorhom/bottom-sheet'; // Import BottomSheet
import MapView, {Marker} from 'react-native-maps'
import tw from 'twrnc'
import {useSelector } from 'react-redux'
import {selectVisitOrder} from "../slices/navSlice.js"
import MapViewDirections from 'react-native-maps-directions'
import { GOOGLE_MAPS_APIKEY } from '@env'

const Map = () => {
    const tsp=useSelector(selectVisitOrder);
    console.log(tsp);

    const tspPairs = [];
    for (let i = 0; i < tsp.length - 1; i++) {
        const current = tsp[i];
        const next = tsp[i + 1];
        tspPairs.push({ current, next });
    }

    let originlat = tsp[0].latitude;
    let originlong = tsp[0].longitude;

    let destinationlat = tsp[0].latitude;
    let destinationlong=tsp[0].longitude;

    for(let i=0;i<tsp.length;i++){
        if(tsp[i].latitude>originlat){
            originlat=tsp[i].latitude;
        }

        if(tsp[i].latitude<destinationlat){
            destinationlat=tsp[i].latitude;
        }

        if(tsp[i].longitude>originlong){
            originlong=tsp[i].longitude;
        }

        if(tsp[i].longitude<destinationlong){
            destinationlong=tsp[i].longitude;
        }
    }

    const mapRef=useRef(null);

    //For now removed the animation:
    useEffect(()=>{

        if(!originlat || !destinationlong)return;

        //Fit to the markers:
        mapRef.current.animateToRegion({
            latitude: (originlat + destinationlat) / 2,
            longitude: (originlong + destinationlong) / 2,
            latitudeDelta: Math.abs(originlat - destinationlat) * 1.2,
            longitudeDelta: Math.abs(originlong - destinationlong) * 1.2,
          });
          
    },[originlat,originlong,destinationlat,destinationlong]);

  return (
     <MapView
       ref={mapRef}
       style={tw `flex-1`}
       mapType='mutedStandard'
       initialRegion={{
         latitude: originlat,
         longitude: originlong,
         latitudeDelta: 0.005,
         longitudeDelta: 0.005,
       }}
       showsUserLocation={true}
     >

{
  tspPairs.map(({ current, next }) => {
    const { id: currentId, latitude: currentLat, longitude: currentLong, text: currentText } = current;
    const { latitude: nextLat, longitude: nextLong } = next;
    
    console.log('Current:', currentLat, currentLong);
    console.log('Next:', nextLat, nextLong);

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
  })
}

{tsp.map(({ id, latitude, longitude, text, color }) => (
    <Marker
        key={id} // Make sure to use a unique key for each Marker
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
  )
}
export default Map