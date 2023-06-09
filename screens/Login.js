/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/prop-types */
/* eslint-disable no-return-assign */
import React from "react";
import {
  View,
  TouchableHighlight,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { connect } from "react-redux";
import * as yup from "yup";
import { Formik } from "formik";
import { baseUrl } from "../utils/host";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Dimensions, KeyboardAvoidingView } from "react-native";

import { Block, Button, Input, NavBar, Text } from "galio-framework";
import theme from "../constants/NewTheme";

const { height, width } = Dimensions.get("window");
import axios from "axios";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: theme.SIZES.BASE * 0.3,
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.WHITE,
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
  },
});

export class Login extends React.Component {
  static navigationOptions = {
    headerShown: false,
    gestureEnabled: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }

  componentDidMount() {}

  getProfile=(user)=>{
    const {setProfile} = this.props
    axios
      .get(`${baseUrl}users/${user}/`)
      .then((response) => {
        const items = response.data
       setProfile(items)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  checkFirstTime=async(passenger)=>{
    try {
      await AsyncStorage.getItem('isTokenSaved').then(async(value) => {
        if (value == null) {
              await this.saveTokenToDB(passenger);
              AsyncStorage.setItem('isTokenSaved', '1' );
          };
      });
    } catch (e) {
      // saving error
    }
  }

  saveTokenToDB=async(passenger)=>{

   
    
      try {
        const value = await AsyncStorage.getItem('notificationtoken')
        if(value !== null) {
          axios
          .post(`${baseUrl}passengernotification/create/`, {
            passenger: passenger,
            expo_token: value,
          })
          .then(async (response) => {
            console.log('saved token to the db');
          })
          .catch((error) => {
            console.log(' token not saved to the db');
          });
        }
      } catch(e) {
        // error reading value
      }
   
  }

  loginUser = async (credentials) => {
    const { navigation, setPassengerDetails } = this.props;
    axios
      .post(`${baseUrl}passengers/account/login/`, {
        email: credentials.email,
        password: credentials.password,
      })
      .then(async (response) => {
        let data=response.data
        setPassengerDetails(data);
        this.checkFirstTime(data.passenger_id)
        this.getProfile(data.user_id)
        Alert.alert('Hitch N Ride', 'You have Logged in ');
        navigation.navigate('App');
      })
      .catch((error) => {
        Alert.alert('Hitch N Ride', 'Oops you have to be connected to the Internet ');
      });
  };

    render() {
    const { navigation } = this.props;

    const check = () => {
      return (
        <Block flex={2} center space="evenly">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={(values) => this.loginUser(values)}
            validationSchema={yup.object().shape({
              email: yup.string().email().required(),
              password: yup.string().min(4).required(),
            })}
          >
            {({
              values,
              handleChange,
              errors,
              setFieldTouched,
              touched,
              isValid,
              handleSubmit,
            }) => (
              <>
                <Block flex={2}>
                  <Text p>Email</Text>
                  <Input
                    rounded
                    type="email-address"
                    placeholder="Email"
                    autoCapitalize="none"
                    style={{ width: width * 0.9 }}
                    onChangeText={handleChange("email")}
                    onBlur={() => setFieldTouched("email")}
                    value={values.email}
                  />

                  {touched.email && errors.email && (
                    <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                      {errors.email}
                    </Text>
                  )}
                  <Text p>Password</Text>
                  <Input
                    rounded
                    password
                    viewPass
                    placeholder="Password"
                    style={{ width: width * 0.9 }}
                    onChangeText={handleChange("password")}
                    onBlur={() => setFieldTouched("password")}
                    secureTextEntry
                  />
                  {touched.password && errors.password && (
                    <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                      {errors.password}
                    </Text>
                  )}
                </Block>
                <Block flex middle>
                  <Button
                    round
                    color="info"
                    style={{ marginTop: theme.SIZES.BASE }}
                    disabled={!isValid}
                    onPress={handleSubmit}
                  >
                    Login
                  </Button>
                </Block>
              </>
            )}
          </Formik>
        </Block>
      );
    };

    return (
      <Block safe flex style={{ backgroundColor: theme.COLORS.WHITE }}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="height"
          enabled
        >
          <Block
            flex
            center
            style={{
              marginTop: theme.SIZES.BASE * 1.875,
              marginBottom: height * 0.1,
            }}
          >
            <Text
              muted
              center
              size={theme.SIZES.FONT}
              style={{ paddingHorizontal: theme.SIZES.BASE }}
            >
              Hitch N Ride
            </Text>
          </Block>
          {check()}
        </KeyboardAvoidingView>
      </Block>
    );
  }
}

function mapStateToProps(state) {
  return {
    notificationToken: state.notificationToken,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setPassengerDetails: (passengerDetails) =>
      dispatch({ type: 'SET_PASSENGER_DETAILS', passengerDetails }),
    setProfile: (profile) =>
      dispatch({ type: 'SET_PROFILE', profile }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
