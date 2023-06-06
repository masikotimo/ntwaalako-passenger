import React, { useEffect } from "react";
import { StyleSheet, Dimensions, ScrollView,Alert } from "react-native";
import { Button, Block, Text, Input, theme } from "galio-framework";
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardButton,
  CardImage,
} from "react-native-cards";
import { useSelector } from "react-redux";
import { baseUrl } from '../utils/host';
import moment from "moment";


import { Icon } from "../components/";

const { width } = Dimensions.get("screen");
import axios from "axios";

function Home() {
  const approvedTrips = useSelector((state) => state.approvedTrips);

  const pendingTrips = useSelector((state) => state.pendingTrips);
  const whichTrip = useSelector((state) => state.whichTrip);

   function updateTrip (trip, action)  {
    const date = moment().format();
    const tripDetails = trip;
    const updateDetails = {
      date: tripDetails.trip.date,
      destination: tripDetails.trip.destination,
      ended_at: action === 'end' ? date : tripDetails.trip.ended_at,
      started_at: action === 'Start' ? date : tripDetails.trip.started_at,
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
        Alert.alert('Hitch N Ride', `Trip has been ${action}ed`)
      }
      )
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  function makePayment(tripId) {
    // axios
    //   .post(`${baseUrl}passengertrips/pay-trip`, {
    //     passenger_trip: tripId,
    //   })
    //   .then((response) => {
    //     console.log("I have made a payment");
    //     //call the set the method
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

      Alert.alert('Ntwalaako', 'Payment has been made')
  }

  function showTrip(items) {
    return items.map((x, k) => {
      return (
        <Card key={k}>
          <CardTitle subtitle={x.trip.destination} />
          <CardContent text={`From ${x.trip.pick_up_location}`} />
          <CardContent text={`Status : ${x.trip.status}`} />
          <CardAction separator={true} inColumn={false}>
            <CardButton
              onPress={() => {
                makePayment(x.id);
              }}
              title="Make Payment"
              color="#FEB557"
            />
          </CardAction>
        </Card>
      );
    });
  }

  const ApprovedTripss = whichTrip
    ? showTrip(approvedTrips)
    : showTrip(pendingTrips);

  return <ScrollView>{ApprovedTripss}</ScrollView>;
}

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
    zIndex: 2,
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.5,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: "300",
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  products: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
  },
});

export default Home;
