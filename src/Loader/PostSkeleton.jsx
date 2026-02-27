import React from 'react';
import { View, StyleSheet } from 'react-native';
import Shimmer from '../Loader/Shimmer';

export default function PostSkeleton() {
  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Shimmer style={styles.avatar} />
        <View style={{ marginLeft: 10 }}>
          <Shimmer style={styles.username} />
          <Shimmer style={styles.sub} />
        </View>
      </View>

      {/* Image */}
      <Shimmer style={styles.image} />

      {/* Action row */}
      <Shimmer style={styles.actions} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  username: {
    width: 120,
    height: 15,
    marginBottom: 6,
    borderRadius: 4,
  },
  sub: {
    width: 80,
    height: 12,
    borderRadius: 4,
  },
  image: {
    marginTop: 15,
    width: '100%',
    height: 350,
    borderRadius: 12,
  },
  actions: {
    marginTop: 15,
    width: 200,
    height: 20,
    borderRadius: 4,
  },
});