import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, {useEffect,useState, useRef} from 'react'
import useAbortableFetch from './hooks/useAbortableFetch';
import { SafeAreaView } from 'react-native';
import * as AuthSession from 'expo-auth-session'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';

const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };

const LoginScreen = () => {
    const navigation = useNavigation()
    useEffect(() => {
        const checkTokenValidity = async () => {{
            const accessToken = await AsyncStorage.getItem("token")
            const expirationDate = await AsyncStorage.getItem("expirationDate")
            console.log("Token:", accessToken, "Expiration:", expirationDate);
            
            if(accessToken && expirationDate){
                const currentTime = Date.now()
                if(currentTime < parseInt(expirationDate)){
                    navigation.replace("Home")
                } else {
                    AsyncStorage.removeItem("token")
                    AsyncStorage.removeItem("expirationDate")
                }
            }
        }
    }
    checkTokenValidity()
    }, [navigation])
    async function authenticate() {
        try {
          const request = new AuthSession.AuthRequest({
            clientId: "0f14e8fa08c040d0a6e1b3efd41436a3",
            scopes: ['user-read-email', 'user-library-read','user-top-read','user-read-recently-played','playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-public'],
            redirectUri: AuthSession.makeRedirectUri({ useProxy: true, scheme: "spotifyAPI" }),
            responseType: 'code',
            usePKCE: true,
          });
      
          const result = await request.promptAsync(discovery);
          console.log("AuthSession Result:", result);
      
          if (result?.type === 'success' && result?.params?.code) {
            const tokenResponse = await fetch(discovery.tokenEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                client_id: "",
                grant_type: 'authorization_code',
                code: result.params.code,
                redirect_uri: AuthSession.makeRedirectUri({ useProxy: true, scheme: "spotifyAPI" }),
                code_verifier: request.codeVerifier,
                client_secret: "" 
              }).toString(),
            });
      
            const tokenData = await tokenResponse.json();
            console.log("Token Exchange Result:", tokenData); 
      
            if (tokenData.access_token) {
              const expirationDate = new Date(tokenData.expires_in * 1000 + Date.now()).getTime();
              await AsyncStorage.setItem("token", tokenData.access_token);
              await AsyncStorage.setItem("expirationDate", expirationDate.toString());
              navigation.replace("Home");
            } else {
              console.log("Token exchange failed", tokenData);
            }
          } else {
            console.log("Login cancelled or failed");
          }
        } catch (error) {
          console.error("Authentication error:", error);
        }
      }
  return (
    <SafeAreaView>
        <View style={{height: 80}}>
            <Pressable style={{
                backgroundColor: "#1DB954",
                padding: 10,
                marginTop:40,
                marginLeft:"auto",
                marginRight:"auto",
                width: 300,
                borderRadius:25,
                alignItems: "center", 
                justifyContent: "center"
                }} onPress={authenticate}>
                <Text>Sign in with spotify</Text>
            </Pressable>
            <StatusBar style="auto" />
        </View>
    </SafeAreaView>
  );
}

export default LoginScreen