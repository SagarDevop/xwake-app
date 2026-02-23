import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { Picker } from '@react-native-picker/picker';
import api from '../api';
import CustomToast from '../Components/CustomToast';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../Redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = () => {
  const navigation = useNavigation();
  // steps state
  const [step, setStep] = useState(1);

  //email sending state
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  //otp
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  //register
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [file, setFile] = useState(null);

  //ui management state
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  const dispatch = useDispatch();
  //function

  const sendOTP = async () => {
    setError('');
    Keyboard.dismiss();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError('Please enter a valid email address');
    }

    setLoading(true);
    console.log('Sending OTP to:', email);

    try {
      const data = await api.post(
        '/api/auth/send-otp',
        { email },
        {
          timeout: 30000,
        },
      );

      setEmailSent(true);
      setStep(2);
      setError('');
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || 'Failed to send OTP',
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const verifyOTPHandler = async () => {
    setError('');

    if (otp.length !== 4) {
      return setError('OTP must be 4 digits');
    }

    setLoading(true);

    try {
      const res = await api.post('/api/auth/verify-otp', { email, otp });
      setOtpVerified(true);
      setStep(3);
      setError('');
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const checkUsernameAvailability = async usernameValue => {
    if (!usernameValue || usernameValue.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);

    try {
      const { data } = await api.post('/api/auth/check-username', {
        username: usernameValue,
      });

      setUsernameAvailable(data.available);
      console.log(data.available);
    } catch (error) {
      setUsernameAvailable(false);
      console.log(error);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleUsernameChange = value => {
    setUsername(value);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout (debounce)
    timeoutRef.current = setTimeout(() => {
      checkUsernameAvailability(value);
    }, 500);
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.didCancel || !result.assets?.length) return;

    const asset = result.assets[0];

    setFile({
      uri: asset.uri,
      name: asset.fileName || 'avatar.jpg',
      type: asset.type || 'image/jpeg',
    });
  };

  const submitHandler = async () => {
    if (username && username.trim().length < 3) {
      return setError('Username must be at least 3 characters');
    }
    if (username && username.trim().length > 20) {
      return setError('Username must be under 20 characters');
    }
    if (username && usernameAvailable === false) {
      return setError('Username is already taken');
    }

    if (name.trim().length < 3) {
      return setError('Name must be at least 3 characters long');
    }
    if (name.trim().length > 20) {
      return setError('Name must be under 20 characters');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    if (!gender) {
      return setError('Please select your gender');
    }

    if (!file) {
      return setError('Profile image is required');
    }

    setError('');

    const formdata = new FormData();
    formdata.append('name', name);
    formdata.append('email', email);
    formdata.append('password', password);
    formdata.append('gender', gender);
    if (username) formdata.append('username', username);
    formdata.append('file', {
      uri:
        Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
      type: file.type || 'image/jpeg',
      name: file.name.replace(/\s/g, '_'),
    });

    console.log('FORM DATA:');
    for (let pair of formdata._parts) {
      console.log(pair[0], pair[1]);
    }

    try {
      setLoading(true);
      const res = await api.post('/api/auth/register', formdata, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(res.data);
      await AsyncStorage.setItem('accessToken', res.data.accessToken);
      await AsyncStorage.setItem('refreshToken', res.data.refreshToken);

      const testToken = await AsyncStorage.getItem('accessToken');
      console.log('JUST SAVED TOKEN:', testToken);
      dispatch(setToken(res.data.accessToken));
      dispatch(setUser(res.data.user));
    } catch (error) {
      console.log('FULL ERROR:', error);
      console.log('STATUS:', error.response?.status);
      console.log('DATA:', error.response?.data);
      console.log('MESSAGE:', error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ alignItems: 'center', marginTop: 60 }}>
        <Image
          style={{ height: 60, width: 80 }}
          source={require('../../assets/Icons/LogoV.png')}
        />
      </View>

      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>
        Join <Text style={styles.accent}>Twikit</Text> and start sharing
      </Text>

      <View style={styles.stepContainer}>
        {[1, 2, 3].map((item, index) => (
          <React.Fragment key={item}>
            <View
              style={[
                styles.stepCircle,
                step >= item ? styles.activeStep : styles.inactiveStep,
              ]}
            >
              <Text
                style={step >= item ? styles.stepTextActive : styles.stepText}
              >
                {item}
              </Text>
            </View>
            {item !== 3 && <View style={styles.stepLine} />}
          </React.Fragment>
        ))}
      </View>

      {step === 1 && (
        <>
          <TextInput
            value={email}
            placeholder="your@email.com"
            placeholderTextColor="#888"
            style={styles.input}
            onChangeText={setEmail}
          />
          {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

          <TouchableOpacity style={styles.primaryBtn} onPress={() => sendOTP()}>
            <Text style={styles.primaryBtnText}>
              {loading ? 'Sending...' : 'Send OTP'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.link}>Or Log In with </Text>

          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              marginTop: 40,
              gap: 30,
            }}
          >
            <Pressable style={styles.box}>
              <Image
                source={require('../../assets/Icons/google.png')}
                style={{ width: 30, height: 30 }}
              />
            </Pressable>
            <Pressable style={styles.box}>
              <Image
                source={require('../../assets/Icons/fa.png')}
                style={{ width: 30, height: 30 }}
              />
            </Pressable>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 20,
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={styles.footerText}>Already on Twikit?</Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text
                style={{
                  color: '#6c63ff',
                  fontWeight: '600',
                  marginLeft: 6,
                  fontSize: 14,
                }}
              >
                Log In
              </Text>
            </Pressable>
          </View>
        </>
      )}

      {step === 2 && (
        <>
          {emailSent ? (
            <Text style={{ color: 'green', marginLeft: 60, marginBottom: 20 }}>
              Email sent to you email {email}
            </Text>
          ) : (
            ''
          )}
          {error ? (
            <Text style={{ color: 'red', marginLeft: 60, marginBottom: 20 }}>
              {error}
            </Text>
          ) : null}
          <Text style={styles.label}>Verification Code</Text>
          <TextInput
            value={otp}
            placeholder="1234"
            placeholderTextColor="#888"
            keyboardType="numeric"
            maxLength={4}
            onChangeText={setOtp}
            style={[styles.input, styles.otpInput]}
          />

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => verifyOTPHandler()}
          >
            <Text style={styles.primaryBtnText}>
              {loading ? 'verfiying..' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: 'row', gap: 5, marginTop: 15 }}
            onPress={() => setStep(1)}
          >
            <MaterialCommunityIcons
              name="keyboard-backspace"
              color="#7f8181"
              size={20}
            />
            <Text style={styles.backText}>Change Email</Text>
          </TouchableOpacity>
          <View
            style={{
              position: 'absolute',
              bottom: 20,
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={styles.footerText}>Already on Twikit?</Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text
                style={{
                  color: '#6c63ff',
                  fontWeight: '600',
                  marginLeft: 6,
                  fontSize: 14,
                }}
              >
                Log In
              </Text>
            </Pressable>
          </View>
        </>
      )}

      {step === 3 && (
        <>
          <View style={styles.avatarWrapper}>
            <Pressable onPress={pickImage} style={styles.avatar}>
              {file ? (
                <Image source={{ uri: file.uri }} style={styles.avatarImage} />
              ) : (
                <>
                  <Entypo name="camera" color="#000" size={24} />
                  <Text style={styles.avatarText}>Upload</Text>
                </>
              )}
            </Pressable>
          </View>

          <View style={styles.inputP}>
            <TextInput
              placeholder=" Username"
              placeholderTextColor="#888"
              value={username}
              onChangeText={text =>
                handleUsernameChange(text.replace(/\s/g, ''))
              }
            />
            {checkingUsername && (
              <Text style={{ color: '#243e53', alignSelf: 'center' }}>...</Text>
            )}
            {!checkingUsername &&
              usernameAvailable === true &&
              username.length >= 3 && (
                <Text style={{ color: 'green', alignSelf: 'center' }}> ✓ </Text>
              )}
            {!checkingUsername &&
              usernameAvailable === false &&
              username.length >= 3 && (
                <Text style={{ color: 'red', alignSelf: 'center' }}> ✗ </Text>
              )}
          </View>

          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#888"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <View style={styles.inputP}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#777"
                style={{ marginTop: 10 }}
              />
            </Pressable>
          </View>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={gender}
              onValueChange={value => setGender(value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </View>

          <TouchableOpacity onPress={submitHandler} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>
              {loading ? 'Creating...' : 'Creat Account'}
            </Text>
          </TouchableOpacity>
        </>
      )}
      <CustomToast
        visible={showToast}
        message="Logged in successfully 🚀"
        type="success"
      />
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
  },

  card: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 24,
  },
  box: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    borderColor: '#f7f4f4',
    backgroundColor: '#fff',
  },
  link: {
    textAlign: 'center',
    color: '#a9a8b1',
    marginTop: 48,
  },

  title: {
    color: '#a4a5a7',
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: 30,
  },

  subtitle: {
    color: '#9ca3af',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },

  accent: {
    color: '#6366f1',
  },

  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },

  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeStep: {
    backgroundColor: '#6366f1',
  },

  inactiveStep: {
    backgroundColor: '#1f2933',
  },

  stepTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },

  stepText: {
    color: '#9ca3af',
  },

  stepLine: {
    width: 30,
    height: 2,
    backgroundColor: '#374151',
  },

  label: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 6,
    marginTop: 14,
  },

  input: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderColor: '#f7f4f4',
    backgroundColor: '#fff',
    paddingLeft: 20,
    fontWeight: 'semibold',
    elevation: 1,
  },
  inputP: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 4,
    marginBottom: 10,
    borderColor: '#f7f4f4',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    fontWeight: 'semibold',
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#f7f4f4',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
    paddingLeft: 13,
    elevation: 6,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#9ca3af',
  },

  otpInput: {
    textAlign: 'center',
    fontSize: 22,
    letterSpacing: 8,
  },

  primaryBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 18,
  },

  primaryBtnText: {
    color: '#fff',
    fontWeight: '600',
  },

  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#1f2933',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
  },

  footerText: {
    color: '#9ca3af',
    textAlign: 'center',
    fontSize: 13,
  },
  backText: {
    color: '#7f8181',
  },
});
