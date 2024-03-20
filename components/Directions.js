import React from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native';
import tw from 'twrnc';
import { useSelector } from 'react-redux';
import { selectVisitOrder } from '../slices/navSlice.js';
import CityDrawer from './CityDrawer.js'

const Directions = () => {
  const tsp = useSelector(selectVisitOrder);
  console.log(tsp);

  // Create tspPairs
  const tspPairs = [];
  for (let i = 0; i < tsp.length - 1; i++) {
    const current = tsp[i];
    const next = tsp[i + 1];
    tspPairs.push({ current, next });
  }

  // Function to render each item in the FlatList
  const renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        {/* <Text>Current: {item.current.text} - Next: {item.next.text} : Distance {parseFloat((item.next.distance/1000).toFixed(1))}, Time {parseFloat((item.next.time/60).toFixed(1))}</Text> */}
        <CityDrawer currentCity={item.current.text} nextCity={item.next.text} distance={item.next.distance} time={item.next.time} color={item.next.color}/>
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={tw`text-center py-5 text-xl`}>Directions</Text>
        <View style={tw `border-t border-gray-300 flex-shrink`}>
            <FlatList
            data={tspPairs}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  item: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default Directions;
