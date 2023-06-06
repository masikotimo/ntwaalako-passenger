import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, ScrollView,Alert } from "react-native";
import { connect } from "react-redux";
import { baseUrl } from "../utils/host";
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardButton,
  CardImage,
} from "react-native-cards";
import moment from "moment";

import axios from "axios";

export class ApprovedTrips extends Component {
  static navigationOptions = {
    headerShown: false,
    gesturesEnabled: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isloaded: false,
    };
    this.credentials = this.props.headers;
  }

  componentDidMount() {
    this.getItems();
  }

  getItems() {
    const { passengerDetails } = this.props;
    axios
      .get(`${baseUrl}passengertrips/${passengerDetails.passenger_id}/`)
      .then((response) => {
        const items = response.data;
        this.setState({ ...this.state, items, isloaded: true });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateTrip = (trip, action) => {
    const date = moment().format();
    const tripDetails = trip;
    const updateDetails = {
      date: tripDetails.trip.date,
      destination: tripDetails.trip.destination,
      ended_at: action === 'end' ? date : tripDetails.trip.ended_at,
      started_at: action === 'begin' ? date : tripDetails.trip.started_at,
      trip: tripDetails.trip.id,
      pick_up_location: tripDetails.trip.pick_up_location,
      reason: tripDetails.trip.reason,
    };
    axios
      .put(
        `${baseUrl}passengertrips/${tripDetails.passenger.id}/${tripDetails.id}/update/`,
        updateDetails
      )
      .then((response) => {
        Alert.alert('Hitch N Ride', 'Trip has begun')
      }
      )
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  makePayment(tripId) {
    // const { passengerDetails } = this.props;
    // axios
    //   .post(`${baseUrl}passengertrips/pay-trip`, {
    //     passenger_trip: tripId,
    //   })
    //   .then((response) => {
    //     Alert.alert('Ntwalaako', 'Payment has been made')
    //     this.getItems();
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    Alert.alert('Ntwalaako', 'Payment has been made')
  }

  render() {
    if (this.state.isloaded) {
      const ApprovedTripss = this.state.items.map((x, k) => {
        return (
          <Card key={k}>
            <CardTitle subtitle={x.trip.destination} />
            <CardContent text={`From ${x.trip.pick_up_location}`} />
            <CardContent text={`Status : ${x.trip.status}`} />

            <CardAction separator={true} inColumn={false}>
              <CardButton
                onPress={() => {
                  this.makePayment(x.id);
                }}
                title="Make Payment"
                color="#FEB557"
              />
            </CardAction>
          </Card>
        );
      });

      return <ScrollView>{ApprovedTripss}</ScrollView>;
    }

    return (
      <ScrollView>
        <Card>
          <CardTitle subtitle="Number 6" />
          <CardContent text="Clifton, Western Cape" />
          {/* <CardAction separator={true} inColumn={false}>
            <CardButton onPress={() => {}} title="Share" color="#FEB557" />
            <CardButton onPress={() => {}} title="Explore" color="#FEB557" />
          </CardAction> */}
        </Card>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    notificationToken: state.notificationToken,
    passengerDetails: state.passengerDetails,
    headers: state.requestHeaders,
  };
}

export default connect(mapStateToProps, null)(ApprovedTrips);
