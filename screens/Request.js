/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-return-assign */
import React from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  BackHandler,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import * as yup from 'yup';
import { Formik } from 'formik';
import { baseUrl } from '../utils/host';
import DriverDropdownList from '../components/DriverDropdownList';
import { Datepicker } from '../components/Datepicker';
import { Block, Button, Input, NavBar, Text } from "galio-framework";
import theme from "../constants/NewTheme";


import axios from 'axios';

const initialValues = {
  pickup_location: '',
  destination: '',
  reason: '',
};
const validationSchema = yup.object().shape({
  pickup_location: yup.string().required(),
  destination: yup.string().required(),
  reason: yup.string().required(),
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 20,
    height:"100%",
    backgroundColor: '#ffffff',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: '#4e4e4e',
    padding: 12,
    marginBottom: 5,
    borderRadius:20,
    marginTop:20
  },
});

export class Request extends React.Component {
  static navigationOptions = {
    headerShown: false,
    // gesturesEnabled: false,
  };

  constructor(props) {
    super(props);

    this.state = {};
    this.credentials = this.props.headers;
    // this.headers = {
    //   headers: { Authorization: `Bearer ${this.credentials.access}` },
    // };
  }

  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.getDrivers();
  }

  handleBackPress = () => {
    return true;
  };

  getVehicles = async () => {
    const { setVehicleDetails,profile } = this.props;
    const availableCars = [];
    axios
      .get(`${baseUrl}vehicles`)
      .then((response) => {
        console.log("my vehicles",response.data)
        response.data.map((x) => {
          const tempObj = {};
          tempObj.label = x.type_of_vehicle;
          tempObj.value = x.id;

          availableCars.push(tempObj);
          return availableCars;
        });
        setVehicleDetails(availableCars);
      })
      .catch(console.log);
  };

  getDrivers = async () => {
    const { setDriverDetails,profile } = this.props;

    const availableDrivers = [];
    axios
      .get(`${baseUrl}drivers/available`)
      .then((response) => {
        console.log("drivers",response.data)

        response.data.map((x) => {
          const tempObj = {};
          tempObj.label = x.user.email;
          tempObj.value = x.id;

          availableDrivers.push(tempObj);
          return availableDrivers;
        });
        setDriverDetails(availableDrivers);
      })
      .catch(console.log);
  };

  sendRequest = async (credentials) => {
    const { navigation, passengerDetails, date, vehicle, driver,profile } = this.props;
    console.log("mydriver",driver)

    let payload = {
      pick_up_location: credentials.pickup_location,
      destination: credentials.destination,
      date,
      reason: credentials.reason,
      driver: driver.value,
      passenger: passengerDetails.passenger_id,
    }

    console.log(payload)
    axios
      .post(
        `${baseUrl}passengertrips/create/`,
        payload
        // this.headers
      )
      .then(async (response) => {
        Alert.alert('Hitch N Ride', 'You have successfully sent a Request ');
        navigation.navigate('Trip');
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('Hitch N Ride', 'Oops you have to be connected to the Internet ');
      });
  };

  
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => this.sendRequest(values)}
            validationSchema={validationSchema}
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
              <View style={styles.formContainer}>
                <Text
              muted
              center
              size={25}
              style={{ paddingHorizontal: theme.SIZES.BASE }}
            >
              Scheduled Ride Details
            </Text>
                <TextInput
                  value={values.pickup_location}
                  style={styles.inputStyle}
                  onChangeText={handleChange('pickup_location')}
                  onBlur={() => setFieldTouched('pickup_location')}
                  placeholder="pickup_location"
                  placeholderTextColor={"grey"}
                />
                {touched.pickup_location && errors.pickup_location && (
                  <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.pickup_location}</Text>
                )}
                <TextInput
                  value={values.destination}
                  style={styles.inputStyle}
                  onChangeText={handleChange('destination')}
                  placeholder="destination"
                  onBlur={() => setFieldTouched('destination')}
                  placeholderTextColor={"grey"}
                />
                {touched.destination && errors.destination && (
                  <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.destination}</Text>
                )}
                <DriverDropdownList />
                <Datepicker />

                
                <TextInput
                  value={values.reason}
                  style={styles.inputStyle}
                  onChangeText={handleChange('reason')}
                  onBlur={() => setFieldTouched('reason')}
                  placeholder="reason"
                  placeholderTextColor={"grey"}

                />
                {touched.reason && errors.reason && (
                  <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.reason}</Text>
                )}


                <Block flex middle>
                  <Button
                    round
                    color="info"
                    style={{ marginTop: theme.SIZES.BASE }}
                    disabled={!isValid}
                    onPress={handleSubmit}
                  >
                    Submit
                  </Button>
                </Block>
              </View>
            )}
          </Formik>


        </View>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    notificationToken: state.notificationToken,
    headers: state.requestHeaders,
    date: state.currentDate,
    vehicle: state.vehicle,
    driver: state.driver,
    passengerDetails: state.passengerDetails,
    profile:state.profile
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setVehicleDetails: (VehicleDetails) => {
      dispatch({
        type: 'SET_VEHICLE_DETAILS',
        VehicleDetails,
      });
    },
    setDriverDetails: (DriverDetails) => {
      dispatch({
        type: 'SET_DRIVER_DETAILS',
        DriverDetails,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Request);
