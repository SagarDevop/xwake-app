import React, { useEffect, useRef } from "react";
import { Text, StyleSheet, Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const CustomToast = ({ visible, message }) => {
  const translateY = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 40,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }, 2200);
    }
  }, [visible]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

export default CustomToast;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    width: width * 0.85,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: "rgba(20,20,20,0.92)",

    // Soft shadow (premium feel)
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },

    elevation: 6,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
