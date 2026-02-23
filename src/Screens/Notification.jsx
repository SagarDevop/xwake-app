import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Notification = () => {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: '500', marginBottom: 10 }}>
        Today
      </Text>
      <View style={styles.notiCont}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1708034677699-6f39d9c59f6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YW5pbWUlMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
          }}
          style={styles.avatar}
        />
        <View
          style={{width: 200, paddingTop:5 }}
        >
          <Text style={{ fontWeight: '500', fontSize:14 }}>
            SagarDevop{' '}
            <Text style={{fontWeight:'400', fontSize:14}}>
              liked your photo{' '}
              <Text style={{ fontSize: 13, color: '#bbb8b8' }}>5h</Text>
            </Text>
          </Text>
        </View>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1708034677699-6f39d9c59f6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YW5pbWUlMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
          }}
          style={styles.post}
        />
      </View>
       <View style={styles.notiCont}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1708034677699-6f39d9c59f6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YW5pbWUlMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
          }}
          style={styles.avatar}
        />
        <View
          style={{width: 200, paddingTop:5 }}
        >
          <Text style={{ fontWeight: '500', fontSize:14 }}>
            SagarDevop{' '}
            <Text style={{fontWeight:'400', fontSize:14}}>
              liked your photo{' '}
              <Text style={{ fontSize: 13, color: '#bbb8b8' }}>5h</Text>
            </Text>
          </Text>
        </View>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1708034677699-6f39d9c59f6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YW5pbWUlMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
          }}
          style={styles.post}
        />
      </View>
       <View style={styles.notiCont}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1708034677699-6f39d9c59f6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YW5pbWUlMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
          }}
          style={styles.avatar}
        />
        <View
          style={{width: 200, paddingTop:5 }}
        >
          <Text style={{ fontWeight: '500', fontSize:14 }}>
            SagarDevop{' '}
            <Text style={{fontWeight:'400', fontSize:14}}>
              Commented in your photo : nice BOY{' '}
              <Text style={{ fontSize: 13, color: '#bbb8b8' }}>5h</Text>
            </Text>
          </Text>
        </View>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1708034677699-6f39d9c59f6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YW5pbWUlMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
          }}
          style={styles.post}
        />
      </View>
       <View style={styles.notiCont}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1708034677699-6f39d9c59f6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YW5pbWUlMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
          }}
          style={styles.avatar}
        />
        <View
          style={{width: 200, paddingTop:5 }}
        >
          <Text style={{ fontWeight: '500', fontSize:14 }}>
            SagarDevop{' '}
            <Text style={{fontWeight:'400', fontSize:14}}>
              liked your photo{' '}
              <Text style={{ fontSize: 13, color: '#bbb8b8' }}>5h</Text>
            </Text>
          </Text>
        </View>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1708034677699-6f39d9c59f6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YW5pbWUlMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
          }}
          style={styles.post}
        />
      </View>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  notiCont: {
    height: 60,
    flexDirection: 'row',
    marginTop:10,
    gap: 10,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },
  post: {
    position:'absolute',
    right: 0,
    height: 50,
    width: 50,
    borderRadius: 8,
  },
});
