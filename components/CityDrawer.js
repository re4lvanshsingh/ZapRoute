import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import tw from 'twrnc'

const CityDrawer = ({ currentCity, nextCity, distance, time, color }) => {


  return (
   <View style={{flexDirection: 'row' }}>
        <View style={{flexDirection: 'column',justifyContent:'center',alignContent:'center'}}>
                <Icon
                    style={[tw`rounded-full p-1`, { backgroundColor: color }]}
                    name="location"
                    type="ionicon"
                    colors="white"
                    size={18}
                /> 
        </View>
        <View style={{flexDirection:'column', marginLeft: 10}}>
            <Text>Current City: {currentCity}</Text>
            <Text>Next City: {nextCity}</Text>
            <Text>Distance: {(distance/1000).toFixed(1)} km</Text>
            <Text>Time: {time}</Text>
        </View>
   </View> 
  );
};
// map-marker-right-outline

const styles = StyleSheet.create({
    rounder: {
      fontSize: 20,
      // Add any additional styles as needed
    },
});

export default CityDrawer;
