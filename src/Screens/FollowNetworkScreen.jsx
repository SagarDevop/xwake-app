import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const screenWidth = Dimensions.get('window').width;
import { useDispatch } from 'react-redux';
import { removeFollower, followUser } from '../Redux/slices/authSlice'
import Toast from 'react-native-toast-message';
import { useState } from 'react';

const Tab = createMaterialTopTabNavigator();

const UserList = ({ route, navigation }) => { 
  const { listData: initialListData, type } = route.params;
  const dispatch = useDispatch();
  
  const [users, setUsers] = useState(initialListData);
  const [loadingId, setLoadingId] = useState(null); 

  const handleAction = async (userId) => {
    setLoadingId(userId); 
    try {
      if (type === 'followers') {
        await dispatch(removeFollower(userId)).unwrap();
        Toast.show({ type: 'success', text1: 'Follower removed' });
        
        setUsers((prevUsers) => {
          const updatedUsers = prevUsers.filter((user) => user._id !== userId);
        
          navigation.setOptions({ tabBarLabel: `${updatedUsers.length} Followers` });
          return updatedUsers;
        });
        
      } else {
        await dispatch(followUser(userId)).unwrap();
        Toast.show({ type: 'success', text1: 'Unfollowed user' });
        
   
        setUsers((prevUsers) => {
          const updatedUsers = prevUsers.filter((user) => user._id !== userId);
          navigation.setOptions({ tabBarLabel: `${updatedUsers.length} Following` });
          return updatedUsers;
        });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: error || 'Action failed' });
    } finally {
      setLoadingId(null); 
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.userRow}>
      <View style={styles.userInfo}>
        <Image 
          source={{ uri: item?.profilePic?.url || 'https://via.placeholder.com/150' }} 
          style={styles.avatar} 
        />
        <View>
          <Text style={styles.username}>{item?.username}</Text>
          <Text style={styles.name}>{item?.name}</Text>
        </View>
      </View>
      
      <Pressable 
        style={styles.actionButton}
        onPress={() => handleAction(item._id)}
        disabled={loadingId === item._id} 
      >
        {loadingId === item._id ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.actionText}>
            {type === 'followers' ? 'Remove' : 'Following'}
          </Text>
        )}
      </Pressable>
    </View>
  );

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={users}
        keyExtractor={(item, index) => item._id ? `${item._id}-${index}` : index.toString()} 
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 50, color: 'gray' }}>
            No users found.
          </Text>
        }
      />
    </View>
  );
};


const FollowNetworkScreen = ({ route }) => {
  const { initialTab, followers, followings } = route.params;

  return (
    <Tab.Navigator
      initialRouteName={
        initialTab === 'followers' ? 'FollowersTab' : 'FollowingTab'
      }
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: 'gray',
        tabBarIndicatorStyle: {
          backgroundColor: '#000',
          height: 1.5,
          marginLeft: screenWidth / 8,
          width: screenWidth / 4,
        },
        tabBarItemStyle: {
          width: screenWidth / 2,
        },
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: '600',
          textTransform: 'none',
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen
        name="FollowersTab"
        component={UserList}
        options={{ tabBarLabel: `${followers.length} Followers` }}
        initialParams={{ listData: followers, type: 'followers' }} 
      />
      <Tab.Screen
        name="FollowingTab"
        component={UserList}
        options={{ tabBarLabel: `${followings.length} Following` }}
        initialParams={{ listData: followings, type: 'following' }} 
      />
    </Tab.Navigator>
  );
};

export default FollowNetworkScreen;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  name: {
    fontSize: 14,
    color: 'gray',
  },
  actionButton: {
    backgroundColor: '#efefef',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 8,
  },
  actionText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#000',
  },
});
