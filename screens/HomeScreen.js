import { StyleSheet, Text, View, SafeAreaView, KeyboardAvoidingView,ScrollView } from 'react-native'
import React,{useRef,useState,useEffect,createRef} from 'react'
import tw from 'twrnc';
import NavOptions from '../components/NavOptions.js';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from '@env'
import { useDispatch } from 'react-redux';
import { setVisitOrder } from '../slices/navSlice.js';
import NavFavourites from '../components/NavFavourites.js';
import { FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import NetInfo from "@react-native-community/netinfo";
import OfflineNotification from '../components/Offline.js';
import { Permissions } from 'expo';
import * as Location from 'expo-location';
import create from '@ant-design/icons/lib/components/IconFont.js';
import { Dimensions } from 'react-native';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers/index.js';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

//Function to request access to current location of user (GPS):
const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        // console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
};

const HomeScreen = () => {

    //To check if we are connected to Internet or not:
    const [isConnected, setIsConnected] = useState(true);
    useEffect(() => {
        // Subscribe to network state changes
        const unsubscribe = NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected);
        });

        // Don't forget to unsubscribe when component unmounts
        return () => {
            unsubscribe();
        };
    }, []);



    //==================================================================================================

    //For accessing location:

    const getLocation = async (id) => {
        await requestLocationPermission();
        try {
            const { coords } = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = coords;
            
            //for debugging
            //console.log('Current location:', latitude, longitude);

            const texts="Current Location";
            googleRef.current.setAddressText("Current Location");

            handleInputChange(id,latitude,longitude,texts);

        } catch(error){
            console.error('Error getting current location:', error);
        }
      };


    //==============================================================================================================
    //for Handling backend:

    //contains the information of all textInputs
    const [textInputs, setTextInputs] = useState([{ id: 1,latitude: '', longitude: '', text: ''}]);

    //contains the information of responseData
    const [responseData, setResponseData] = useState([]);


    const dispatch = useDispatch();

    const sendDataToBackend = async () => {
        try {
            // Combine all input data into a single object
            const requestData = {
                inputs: textInputs.map(({ id, latitude, longitude, text }) => ({ id, latitude, longitude, text }))
            };
            console.log(requestData);
            
            // Send the combined data to the backend
            const response = await fetch('https://zaproute.onrender.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
    
            // Handle response if needed
            const responseData = await response.json();
            setResponseData(responseData);

            //Dispatch to redux store for future use in Map.js
            dispatch(setVisitOrder(responseData));

            //To check the TSP path obtained:
            console.log(responseData);
        } catch (error) {
            console.error('Error sending data to backend:', error);
        }
    };
    
    
      
    //===========================================================================================================
      //for dealing with dynamic amount of textboxes:

  // Function to add a new textbox
  const addTextInput = () => {
    const newId = Math.random();
    setTextInputs([...textInputs, { id: newId,latitude: '', longitude: '', text: ''}]);
  };

  // Function to remove a specific textbox
  const removeTextInput = (idToRemove) => {
    const updatedInputs = textInputs.filter((input) => input.id !== idToRemove);
    setTextInputs(updatedInputs);
  };

  // Function to handle text input change
  const handleInputChange = (id, latitudes,longitudes, texts) => {
    const updatedInputs = textInputs.map((input) =>
      input.id === id ? { ...input, id: input.id, latitude: latitudes, longitude: longitudes, text: texts } : input
    );
    
    setTextInputs(updatedInputs);
};

const googleRef=useRef(null);

const renderItem = ({ item }) => (
    <View key={item.id} style={styles.textInputRow}>
      <GooglePlacesAutocomplete
        ref={(item.id === textInputs[0].id) ? googleRef : null}
        placeholder={(item.id === textInputs[0].id) ? 'Start' : 'Where To?'}
        styles={{
          container: {
            flex: 1,
          },
          textInput: {
            fontSize: 18,
            height: 40,
            borderWidth: 1,
            borderColor: 'gray',
            marginLeft: 20,
            marginTop: 8,
          },
        }}
        onPress={(data, details) => {
          handleInputChange(item.id, details.geometry.location.lat, details.geometry.location.lng, data.description);
        }}
        fetchDetails={true}
        returnKeyType={"search"}
        enablePoweredByContainer={false}
        minLength={2}
        query={{
          key: GOOGLE_MAPS_APIKEY,
          language: "en"
        }}
        nearbyPlacesAPI='GooglePlacesSearch'
        debounce={400}
      />

      <View>
        <TouchableOpacity onPress={() => removeTextInput(item.id)}
          style={{
            marginLeft: 10,
          }}
        >
          <Icon
            style={tw `rounded-full `}
            name="remove-circle"
            type="ionicon"
            colors="white"
            size={30}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[tw `flex-row items-center p-5`]}
        onPress={() => getLocation(item.id)}>
        {item.id === textInputs[0].id &&
          <Icon
            style={tw `rounded-full bg-gray-300 p-1`}
            name="location"
            disabled={item.id !== textInputs[0].id}
            type="ionicon"
            colors="white"
            size={18}
          />
        }
      </TouchableOpacity>
    </View>
  );

    return (
        
    <SafeAreaView style={tw `bg-white flex-1`}>
        <View style={tw `p-5`}>
            {/* The name of our app - ZapRoute (an efficient way to route between cities) */}
            <Text style={{color:"black", paddingTop:30, paddingBottom:5 ,fontWeight:"bold",fontSize:35 }}>ZapRoutes</Text>

            {/* This is for the options section - Ride / Get Food (future addition) */}
        </View>

        <ScrollView>

        <View style={{flex:1}}>
        <FlatList
      data={textInputs}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
    />

        <TouchableOpacity onPress={() => {
    addTextInput();
}} style={{position:'relative',paddingBottom:30,paddingLeft:3}}>
            
        <Icon
                    style={tw `rounded-full`}
                    name="add-circle"
                    type="ionicon"
                    colors="white"
                    size={30}
                />

        </TouchableOpacity>
      </View>

    
      <View style={{position:'relative', paddingBottom:ScreenHeight*0.15, alignContent:'center',paddingLeft:ScreenWidth*0.01}}>
      <NavOptions sendDataToBackend={sendDataToBackend} textInputs={textInputs}/>
      
    </View>
    </ScrollView>

        {/***********************************************************************************************************/}
      {/*Dealing with backend*/}
      {/* <Button title="Send Data" onPress={sendDataToBackend} />
      
      <Text style={styles.responseText}>Response from Backend:</Text>
      {responseData.map(({ id, latitude, longitude, text }) => (
    <View key={Math.random()}>
        <Text style={styles.responseText}>
            Textbox {id}:
            Latitude: {latitude ? latitude : 'N/A'}, 
            Longitude: {longitude ? longitude : 'N/A'},
            Text: {text}
        </Text>
    </View>
))} */}



        {/********************************************************************************************/}
        {/* For checking the connection - if we are connected or not */}
        {!isConnected && 
        <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0
        }}>
            <OfflineNotification/>
        </View>}
    </SafeAreaView>
    
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    textInputsContainer: {
        flex: 1,
      marginBottom: 10,
    },
    textInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 3
    },
    textInput: {
      flex: 1,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginRight: 10,
    },
    removeText: {
      color: 'red',
    },
    addText: {
      color: 'blue',
      marginTop: 5,
    },
    responseText: {
      marginTop: 20,
      fontSize: 16,
    },
  });

export default HomeScreen