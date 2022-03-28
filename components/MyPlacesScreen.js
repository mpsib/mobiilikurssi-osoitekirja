import { useEffect, useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import { Button, Input, ListItem } from 'react-native-elements'
import { styles } from './Styles'
import * as SQLite from 'expo-sqlite'


const db = SQLite.openDatabase('addressbook.db');

export default function MyPlacesScreen ( {navigation} ) {
  const [address, setAddress] = useState('');
  const [addressList, setAddressList] = useState([]);

  useEffect( () => {
    db.transaction( tx => {
      tx.executeSql('create table if not exists address (id integer primary key not null, address text);')
    }, null, updateAddressList)
  }, []);

  const updateAddressList = () => {
    db.transaction( tx => {
      tx.executeSql('select * from address;', [], (_, {rows}) => 
        setAddressList(rows._array)
      );
    }, null, null )
  };

  const saveAddress = () => {
    db.transaction( tx => {
      tx.executeSql('insert into address (address) values (?);',
        [address]);
    }, null, updateAddressList)
  };

  const deleteAddress = (id) => {
    db.transaction( tx => {
      tx.executeSql('delete from address where id = ?;', [id]);
    }, null, updateAddressList)
  };

  const handleSaveAddress = () => {
    saveAddress();
    setAddress('');
  };

  return (
    <View style={styles.container}>
      
      <Input 
        placeholder='Type in address'
        label='PLACEFINDER'
        onChangeText={text => setAddress(text)}
        value={address}
      />

      <Button
        title='SAVE'
        containerStyle={styles.saveButtonContainer}
        raised
        icon={{type:'material', name:'save', color:'#fff'}}
        onPress={handleSaveAddress}
      />

      <View style={styles.spacer} />

      <FlatList 
        style={styles.addressList}
        data={addressList}
        renderItem={ ({item}) => (
          <ListItem 
            bottomDivider 
            onLongPress={() => deleteAddress(item.id)}
            onPress={() => navigation.navigate('Map', {address: item.address})}
          >
            <ListItem.Content>
              <ListItem.Title style={styles.listItem}>{item.address}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Content>
              <ListItem.Subtitle style={styles.listItemButton}>show on map</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ) }
        keyExtractor={ (item) => item.id.toString() }
      />

    </View>
  )
}