import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import ProfileTabs from '../Navigation/ProfileTabs'

const Profile = () => {
  return (
    <View style={{ flex: 1, backgroundColor:'#fff' }}>
      <View style={styles.header}>
        <AntDesign name="plus" color="#000" size={24} />
        <Text style={{ fontSize: 17, fontWeight: '500' }}>SagarDevop</Text>
        <Octicons name="three-bars" color="#000" size={20} />
      </View>
      <View style={styles.info}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1708034677699-6f39d9c59f6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YW5pbWUlMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
          }}
          style={{ height: 80, width: 80, borderRadius: 100 }}
        />
        <View style={{ height: 80, flexDirection: 'column', gap: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: '500' }}>Sagar</Text>
          <View style={{ flexDirection: 'row', gap: 33 }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>10</Text>
              <Text style={{ fontSize: 14, fontWeight: '400' }}>posts</Text>
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>20</Text>
              <Text style={{ fontSize: 14, fontWeight: '400' }}>followers</Text>
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>121</Text>
              <Text style={{ fontSize: 14, fontWeight: '400' }}>following</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{ marginHorizontal: 20 }}>
        <Text
          style={{
            fontWeight: '400',
            paddingRight: 20,
            color: '#3b3b3b',
            fontSize: 15,
          }}
        >
          "I am sagar making this plateform for you" Thnakyou for you support
        </Text>
      </View>
      <View style={styles.auradash}>
        <Text style={{ fontWeight: '500' }}>Aura dashboard</Text>
        <Text style={{ fontSize: 13, color: '#8a8787' }}>
          123 Aura in last 30 days
        </Text>
      </View>
      <View style={styles.twobtn}>
        <Pressable style={styles.btn}>
          <Text style={{ fontWeight: '500' }}>Edit profile</Text>
        </Pressable>
        <Pressable
          style={styles.btn}
        >
          <Text style={{ fontWeight: '500' }}>Share profile</Text>
        </Pressable>
      </View>
      <ProfileTabs/>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  info: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  auradash: {
    backgroundColor: '#dbddddc4',
    height: 55,
    marginHorizontal: 20,
    marginTop: 22,
    borderRadius: 12,
    padding: 7,
    flexDirection: 'column',
    gap: 2,
    paddingLeft: 15,
  },
  twobtn: {
    marginTop: 10,
    height: 35,
    flexDirection: 'row',
    gap: 5,
    marginHorizontal: 20,
    marginBottom:40
  },
  btn: {
    width: 157,
    backgroundColor: '#dbddddc4',
    borderRadius: 8,
    alignItems: 'center',
    paddingTop: 7,
  },
});
