import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React from 'react';
import Video from 'react-native-video';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ReelCard = ({ video, isActive }) => {
  return (
    <View style={{ height: 675 }}>
      <Video
        source={{ uri: video }}
        style={{ flex: 1 }}
        resizeMode="cover"
        repeat
        paused={!isActive} //THIS CONTROLS PLAY / PAUSE
      />
      {/* user info  */}
      <View style={styles.topHeader}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={styles.avatar}
              source={{
                uri: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=387',
              }}
            />
            <View style={{ marginLeft: 8, flexDirection: 'row', gap: 15 }}>
              <Text style={styles.username}>SagarDevops</Text>
              <Pressable style={styles.followBtn}>
                <Text style={{ fontWeight: '600', color: 'white' }}>
                  Follow
                </Text>
              </Pressable>
            </View>
          </View>
          <Text style={{ marginTop: 5, color: '#ffffff' }}>
            This is caption check
          </Text>
        </View>

        <Entypo
          style={{ marginBottom: 25 ,marginRight:15}}
          name="dots-three-vertical"
          color="#fff"
          size={18}
        />
      </View>

      {/* user info  */}

      {/* right side btn */}

      <View style={styles.rightBtn}>
        <View style={{ flexDirection: 'column', gap: 5 }}>
          <Feather name="thumbs-up" color="#ffffff" size={30} />
          <Text style={{ color: 'white' }}>30 k</Text>
        </View>
        <View style={{ flexDirection: 'column', gap: 5, alignItems: 'center' }}>
          <Feather name="thumbs-down" color="#ffffff" size={30} />
          <Text style={{ color: 'white' }}>1 k</Text>
        </View>
        <View style={{ flexDirection: 'column', gap: 5 }}>
          <MaterialIcons name="comment" color="#ffffff" size={30} />
          <Text style={{ color: 'white' }}>30 k</Text>
        </View>
        <View style={{ flexDirection: 'column', gap: 5 }}>
          <Feather name="send" color="#ffffff" size={30} />
          <Text style={{ color: 'white' }}>30 k</Text>
        </View>
        <View style={{ flexDirection: 'column', gap: 5 }}>
          <Feather name="send" color="#ffffff" size={30} />
          <Text style={{ color: 'white' }}>30 k</Text>
        </View>
      </View>

      {/* right side btn */}
    </View>
  );
};

export default ReelCard;

const styles = StyleSheet.create({
  topHeader: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    height: 70,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  avatar: {
    height: 40,
    width: 40,
    borderRadius: 100,
  },

  username: {
    fontWeight: '600',
    fontSize: 15,
    color: '#fff',
  },

  time: {
    fontSize: 13,
    color: '#ddd',
  },

  followBtn: {
    borderWidth: 1,
    borderColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },

  rightBtn: {
    flexDirection: 'column',
    width: 60,
    height: 352,
    position: 'absolute',
    right: 5,
    top: 230,
    alignItems: 'center',
    gap: 20,
  },
});
