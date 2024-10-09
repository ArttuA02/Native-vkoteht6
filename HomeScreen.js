import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TextInput, View, SafeAreaView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import React, {useState, useRef, useEffect} from 'react'
import LoginScreen from './LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ArtistCard from './ArtistCard';


const HomeScreen = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [topArtists, setTopArtists] = useState([]);
  
    const getProfile = async () => {
      const accessToken = await AsyncStorage.getItem('token')
      if (!accessToken) {
        console.log("No access token found");
        return;
      }
      try {
        const response = await fetch("https://api.spotify.com/v1/me",{
          headers:{
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (!response.ok) {
            throw new Error("Failed to fetch user profile");
        }

        const data = await response.json()
        setUserProfile(data)
        return data
      } catch(err) {
        console.log(err)
      }
    }
    useEffect(() => {
      getProfile()
    }, [])

    useEffect(() => {
        const getTopItems = async () => {
                const accessToken = await AsyncStorage.getItem('token')
                if(!accessToken){
                    console.log("access token not found")
                    return
                }
                const type = "artists"
                const response = await fetch(`https://api.spotify.com/v1/me/top/${type}`,{
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    } 
                })
    
                const responseBody = await response.text();
                console.log("Response Body:", responseBody);
    
                if (!response.ok) {
                    console.error("Error fetching top artists:", responseBody);
                    return;
                }
                const data = JSON.parse(responseBody);
                setTopArtists(data.items);
        }
        getTopItems()
    }, [])
    console.log(topArtists)
    return (
      <LinearGradient colors={["#040306","#131624"]} style={{flex: 1}}>
        <ScrollView>
          <View>
            <View>
                <Image style={styles.profilePic} source={{uri:userProfile?.images[0].url}} />
            </View>
          </View>
          <Text style={styles.topArtists}>Your top Artists</Text>
          <ScrollView horizontal showHorizontalScrollIndicator={false}>
            {topArtists.map((item,index) => (
                <ArtistCard item={item} key={index} />
            ))}
          </ScrollView>
        </ScrollView>
      </LinearGradient>
    )

    };
    
    export default HomeScreen;

const styles = StyleSheet.create({
    profilePic: {
        marginTop:10,
        marginLeft:10,
        width: 40,
        height: 40,
        borderRadius: 20,
        resizeMode: 'cover'
    },
    topArtists: {
        color: 'white',
        fontSize: 19,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 10
    }
})