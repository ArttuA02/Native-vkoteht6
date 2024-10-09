import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const ArtistCard = ({item}) => {
  return (
    <View>
      <Image style={styles.artistImages} source={{uri: item.images[0].url}}/>
    </View>
  )
}

export default ArtistCard

const styles = StyleSheet.create({
    artistImages: {
        width: 130,
        height: 130,
        borderRadius: 5
    }
})