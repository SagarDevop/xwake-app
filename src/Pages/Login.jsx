import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../api';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../Redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomToast from '../Components/CustomToast';
const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOTP, setForgotOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss();
    const cleanedInput = loginInput.trim().replace(/\s/g, '');

    const cleanedPassword = password.trim();

    const isEmail = cleanedInput.includes('@');

    const payload = isEmail
      ? { email: cleanedInput, password: cleanedPassword }
      : { email: cleanedInput, password: cleanedPassword };
    try {
      setLoading(true);
      const res = await api.post('/api/auth/login/', payload);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 1000);
      console.log('LOGIN RESPONSE:', res.data);
      await AsyncStorage.setItem('accessToken', res.data.accessToken);
      await AsyncStorage.setItem('refreshToken', res.data.refreshToken);

      const testToken = await AsyncStorage.getItem('accessToken');
      console.log('JUST SAVED TOKEN:', testToken);
      dispatch(setToken(res.data.accessToken));
      dispatch(setUser(res.data.user));

      setError('');
    } catch (error) {
      console.log('LOGIN ERROR FULL:', error.response?.data);

      setError(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          error.message ||
          'Login failed',
      );

    } finally {
      setLoading(false);
    }
  };

  const handleSendResetOTP = async e => {
    setForgotError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      return setForgotError('Please enter a valid email address');
    }

    setForgotLoading(true);

    try {
      const { data } = await api.post('/api/auth/forgot-password', {
        email: forgotEmail,
      });
      setForgotStep(2);
      setForgotError('');
    } catch (error) {
      setForgotError(
        error.response?.data?.message || 'Failed to send reset code',
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async e => {
    setForgotError('');

    if (forgotOTP.length !== 4) {
      return setForgotError('OTP must be 4 digits');
    }

    if (newPassword.length < 6) {
      return setForgotError('Password must be at least 6 characters');
    }

    setForgotLoading(true);

    try {
      const { data } = await api.post('/api/auth/reset-password', {
        email: forgotEmail,
        otp: forgotOTP,
        newPassword,
      });
      setShowForgotModal(false);
      setForgotStep(1);
      setForgotEmail('');
      setForgotOTP('');
      setNewPassword('');
      alert(data.message);
    } catch (error) {
      setForgotError(
        error.response?.data?.message || 'Failed to reset password',
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotStep(1);
    setForgotEmail('');
    setForgotOTP('');
    setNewPassword('');
    setForgotError('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Image
                style={{ height: 60, width: 80 }}
                source={require('../../assets/Icons/LogoV.png')}
              />
            </View>

            <View style={{ marginTop: 30, marginHorizontal: 30 }}>
              <Text style={styles.title}>Log In to your Account</Text>
              <Text style={styles.subtitle}>
                Join <Text style={styles.accent}>Twikit</Text> and start sharing
              </Text>
              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TextInput
                placeholder="Email or Username"
                style={styles.input}
                value={loginInput}
                onChangeText={setLoginInput}
              />

              <View style={styles.passwordBox}>
                <TextInput
                  placeholder="Password"
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Icon
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={22}
                    color="#777"
                  />
                </Pressable>
              </View>

              <Pressable onPress={() => setShowForgotModal(true)}>
                <Text style={styles.forgot}>Forgot password?</Text>
              </Pressable>

              <Pressable onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>
                  {loading ? 'Logging in...' : 'Log In'}
                </Text>
              </Pressable>

              <Text style={styles.link}>Or Log In with </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: 30,
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
                  marginTop: 70,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#828283' }}>Don't have an account?</Text>

                <Pressable onPress={() => navigation.navigate('Register')}>
                  <Text
                    style={{
                      color: '#6c63ff',
                      fontWeight: '600',
                      marginLeft: 6,
                      fontSize: 14,
                    }}
                  >
                    Sign Up
                  </Text>
                </Pressable>
              </View>

              <Modal visible={showForgotModal} transparent animationType="fade">
                <View style={styles.modalBg}>
                  <View style={styles.modalCard}>
                    <Text style={styles.modalTitle}>Reset Password</Text>

                    <View style={styles.stepContainer}>
                      <View
                        style={[
                          styles.stepCircle,
                          forgotStep >= 1
                            ? styles.stepActive
                            : styles.stepInactive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.stepText,
                            forgotStep >= 1 && styles.stepTextActive,
                          ]}
                        >
                          1
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.stepLine,
                          forgotStep >= 2
                            ? styles.stepLineActive
                            : styles.stepLineInactive,
                        ]}
                      />

                      <View
                        style={[
                          styles.stepCircle,
                          forgotStep >= 2
                            ? styles.stepActive
                            : styles.stepInactive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.stepText,
                            forgotStep >= 2 && styles.stepTextActive,
                          ]}
                        >
                          2
                        </Text>
                      </View>
                    </View>

                    

                    {forgotStep === 1 && (
                      <>
                        <TextInput
                          placeholder="Email"
                          style={styles.input}
                          value={forgotEmail}
                          onChangeText={setForgotEmail}
                        />

                        <Pressable
                          style={styles.button}
                          onPress={() => {
                            setForgotStep(2);
                            handleSendResetOTP();
                          }}
                        >
                          <Text style={styles.buttonText}>Send OTP</Text>
                        </Pressable>
                      </>
                    )}

                    {forgotStep === 2 && (
                      <>
                        <TextInput
                          placeholder="4-digit OTP"
                          style={styles.input}
                          value={forgotOTP}
                          onChangeText={v =>
                            setForgotOTP(v.replace(/\D/g, '').slice(0, 4))
                          }
                          keyboardType="number-pad"
                        />

                        <View style={styles.passwordBox}>
                          <TextInput
                            placeholder="New Password"
                            style={styles.passwordInput}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showNewPassword}
                          />
                          <Pressable
                            onPress={() => setShowNewPassword(!showNewPassword)}
                          >
                            <Icon
                              name={
                                showPassword ? 'eye-outline' : 'eye-off-outline'
                              }
                              size={22}
                              color="#777"
                            />
                          </Pressable>
                        </View>

                        <Pressable
                          style={styles.button}
                          onPress={() => {
                            setShowForgotModal(false);
                            handleResetPassword();
                            closeForgotModal();
                          }}
                        >
                          <Text style={styles.buttonText}>Reset Password</Text>
                        </Pressable>
                      </>
                    )}

                    <Pressable
                      onPress={() => {
                        setShowForgotModal(false);
                        setForgotStep(1);
                        setForgotEmail('');
                        setForgotOTP('');
                        setNewPassword('');
                        setForgotError('');
                      }}
                    >
                      <Text style={styles.close}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      <CustomToast
        visible={showToast}
        message="Logged in successfully 🚀"
        type="success"
      />
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#8a8b8b',
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderColor: '#f7f4f4',
    backgroundColor: '#fff',
    paddingLeft: 20,
    fontWeight: 'semibold',
    elevation: 1,
  },
  box: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    borderColor: '#f7f4f4',
    backgroundColor: '#fff',
  },
  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderColor: '#f7f4f4',
    backgroundColor: '#fff',
    elevation: 1,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
  },
  eye: {
    fontSize: 18,
  },
  forgot: {
    textAlign: 'right',
    marginBottom: 20,
    color: '#6c63ff',
  },
  button: {
    backgroundColor: '#6c63ff',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    color: '#a9a8b1',
    marginTop: 40,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  close: {
    textAlign: 'center',
    marginTop: 14,
    color: 'gray',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepActive: {
    backgroundColor: '#6c63ff',
  },

  stepInactive: {
    backgroundColor: '#e5e7eb',
  },

  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },

  stepTextActive: {
    color: '#ffffff',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 45,
  },

  accent: {
    color: '#6366f1',
  },

  stepLine: {
    width: 48,
    height: 2,
    marginHorizontal: 8,
  },

  stepLineActive: {
    backgroundColor: '#6c63ff',
  },

  stepLineInactive: {
    backgroundColor: '#e5e7eb',
  },
});
