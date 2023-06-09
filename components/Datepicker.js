/* eslint-disable import/prefer-default-export */
import React, { useState,useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, View, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { baseUrl } from '../utils/host';
import moment from 'moment';

import axios from 'axios';

export const Datepicker = () => {
  const driver = useSelector((state) => state.driver);
  const currentDate = useSelector((state) => state.currentDate);
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('datetime');
  const [show, setShow] = useState(false);
  const [time, setTime] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(()=>{
    getUnAvailableTimes()
  },[isLoaded])

  const getUnAvailableTimes = () => {
    axios
          .post(`${baseUrl}get-driver-time/`, {
            driver: driver.value,
          })
          .then(async (response) => {
            const items=response.data.map((item)=> moment(item).format(moment.HTML5_FMT.DATE));
            setTime(items);
          })
          .catch((error) => {
            console.log(' not gotten');
          });
  };




  const onChange = (event, selectedDate) => {
    changedDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(changedDate);
    dispatch({ type: 'SET_DATE', currentDate:changedDate });
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('datetime');
  };

  const closeMode = () => {
    IsAvailable()? Alert.alert('Hitch N Ride', 'Driver not available on that day.Please select another day '):setShow(false);
    
    
  };

  const IsAvailable = () => {
    return time.includes(moment(currentDate).format(moment.HTML5_FMT.DATE) )
  };

  return (
    <View>
      <View>
        <Button onPress={showDatepicker} title="select date" />
        {/* <Button onPress={closeMode} title="done" /> */}
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};
