import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectOrigin, setDestination,selectVisitOrder } from '../slices/navSlice';

const data = [
    {
        id: "123",
        title: "Get Best Route",
        image: "https://links.papareact.com/3pn",
        screen: "MapScreen"
    }
];

const NavOptions = ({sendDataToBackend,textInputs}) => {
    const navigation = useNavigation();
    const visitorder = useSelector(selectVisitOrder);

    const combine = async () =>{
        await sendDataToBackend();
        navigation.navigate("MapScreen");
    }

  return (
    <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
            <TouchableOpacity
            onPress={combine}
            disabled={!textInputs.length || (textInputs.length>=1 && textInputs[0].latitude==='')}
            >
                <View style={tw `${(!textInputs.length || (textInputs.length>=1 && textInputs[0].latitude==='')) && "opacity-20"}`}>
                    {/* <Image
                        style={{width: 120, height: 120, resizeMode: "contain"}}
                        source={{uri: item.image}}
                    />
                    <Text style={tw `mt-2 text-lg font-semibold`}>{item.title}</Text> */}
                    <Icon
                    style={tw `rounded-full`}
                    name="chevron-forward-circle-outline"
                    type="ionicon"
                    colors="white"
                    size={60}
                /> 
                </View>
            </TouchableOpacity>
        )}
    />
  )
}

export default NavOptions;