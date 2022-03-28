import { Alert, View } from 'react-native';
import { styles } from './Styles';
import MapView, { Marker } from 'react-native-maps';
import { MapQuestApiKey } from './MapQuestApiKey';
import { useEffect, useState } from 'react';

const initialRegion = {
  latitude: 60.200692,
  longitude: 24.934302,
  latitudeDelta: 0.0322,
  longitudeDelta: 0.0221,
  marker: false,
}

const mapQuestAddressSearch = 'http://www.mapquestapi.com/geocoding/v1/address';

export default function MapScreen ( {route, navigation} ) {
  const { address } = route.params;
  const [region, setRegion] = useState(initialRegion);

  useEffect(()=>{
    fetchAddressData();
  },[]);

  const fetchAddressData = () => {
    fetch(`${mapQuestAddressSearch}?key=${MapQuestApiKey}&location=${address}`)
      .then( req => req.json() )
      .then( data => {
        console.log(data)
        setRegion(
          {
            ...region,
            latitude: data.results[0].locations[0].latLng.lat,
            longitude: data.results[0].locations[0].latLng.lng,
            marker: true
          }
        )
      })
      .catch( e => Alert.alert(e.message) );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
      >
        {
          region.marker ?
            <Marker
              coordinate={region}
              title={address}
            />
          : null
        }
        
      </MapView>
    </View>
  )
}