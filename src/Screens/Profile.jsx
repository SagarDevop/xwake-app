import {
  Image,
  ImageBackground,
  Pressable,
  ScrollViewComponent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import ProfileTabs from '../Navigation/ProfileTabs';
import { useSelector } from 'react-redux';
import { isSameId, includesId } from '../Utils/Idutils';
import { useState } from 'react';
import api from '../api';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const navigation = useNavigation()
  const user = useSelector(state => state.auth.user);
  const posts = useSelector(state => state.feed.posts);

  const myPosts = posts?.filter(p => isSameId(p.owner?._id, user._id));

  //states
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);

  const fetchFollowData = async () => {
    try {
      const response = await api.get("/api/user/followdata/" + user._id + "?t=" + Date.now());
      setFollowersData(response.data.followers);
      setFollowingsData(response.data.followings);
    } catch (error) {
      console.error('Error fetching followers data:', error);
    }  
  };
  useEffect(() => {
    fetchFollowData();  
  }, [user?.followers?.length, user?.followings?.length]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <AntDesign name="plus" color="#000" size={24} />
        <Text style={{ fontSize: 17, fontWeight: '500' }}>
          {user?.username}
        </Text>
        <Octicons name="three-bars" color="#000" size={20} />
      </View>
      <View style={styles.info}>
        <Image
          source={{
            uri: user?.profilePic?.url,
          }}
          style={{ height: 80, width: 80, borderRadius: 100 }}
        />
        <View style={{ height: 80, flexDirection: 'column', gap: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: '500' }}>{user?.name}</Text>
          <View style={{ flexDirection: 'row', gap: 33 }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                {myPosts.length}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400' }}>posts</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 33 }}>
            
            <Pressable onPress={() => navigation.navigate('FollowNetwork', { 
                initialTab: 'followers', 
                followers: followersData, 
                followings: followingsData 
            })}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                {user.followers.length}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400' }}>followers</Text>
            </Pressable>


            <Pressable onPress={() => navigation.navigate('FollowNetwork', { 
                initialTab: 'following', 
                followers: followersData, 
                followings: followingsData 
            })}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                {user.followings.length}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400' }}>following</Text>
            </Pressable>
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
          {user?.bio || 'spare something about you'}
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
        <Pressable style={styles.btn}>
          <Text style={{ fontWeight: '500' }}>Share profile</Text>
        </Pressable>
      </View>
     
        <ProfileTabs data={myPosts} /> 
  
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
    marginBottom: 40,
  },
  btn: {
    width: 157,
    backgroundColor: '#dbddddc4',
    borderRadius: 8,
    alignItems: 'center',
    paddingTop: 7,
  },
});
