import { CompositeNavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, Pressable, Alert } from 'react-native';
import RNLocation from 'react-native-location';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './RootStackPrams';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

RNLocation.configure({});

let started = 0;

type authScreenProp = StackNavigationProp<RootStackParamList, 'NextDays'>;

const NextDays = ({weather, temperature} : {weather:any, temperature:any}) => { 
    
    const navigation = useNavigation<authScreenProp>();

    let [viewLocation, isViewLocation] = useState<Location | null>();

    let [temp, setTemp] = useState('--');
    let [icon, setIcon] = useState(require('./../../assets/images/01.png'));
    let [weatherText, setWeatherText] = useState(' ');
    let [min, setMin] = useState('--');
    let [max, setMax] = useState('--');
    let [list, setList] = useState([]);

    // let temp = '--';
    // let icon = '01';
    // let weatherText = 'Overcast Clouds';
    // let min = '10';
    // let max = '30';

    // let list = ['1', '2', '3', '4', '5'];

    const getLocation = async () => {
    
        let permission = await RNLocation.checkPermission({
          ios: 'whenInUse', // or 'always'
          android: {
            detail: 'coarse' // or 'fine'
          }
        });
      
        console.log(permission)
    
        let location;
        if(!permission) {
            permission = await RNLocation.requestPermission({
                ios: "whenInUse",
                android: {
                detail: "coarse",
                rationale: {
                    title: "We need to access your location",
                    message: "We use your location to show where you are on the map",
                    buttonPositive: "OK",
                    buttonNegative: "Cancel"
                }
                }
            })
            console.log(permission)
            location = await RNLocation.getLatestLocation({timeout: 5000})
            console.log(location);

            if (location && started == 1) {
                getWeather(location.latitude.toString(), location.longitude.toString());
            }
        } else {
            location = await RNLocation.getLatestLocation({timeout: 5000})
            console.log(location)
            if (location && started == 1) {
                getWeather(location.latitude.toString(), location.longitude.toString());
            }
        }
    }

    const getWeather = async (lat: string, long: string) => {
        try {
            const response = await fetch(
                'http://api.openweathermap.org/data/2.5/onecall?units=metric&lat=' + lat + '&lon=' + long + '&APPID=e993afcdbfe58a0c988f97f30f129feb'
            );
            const json = await response.json();

            let tempDaily = json['daily']

            setList(tempDaily);

        } catch (error) {
            // console.error(error);
        }
    }

    const isToday = (time: any) => {

        let newStartDate = new Date(time['dt'] * 1000);
        newStartDate = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), newStartDate.getDate());
        let newEndDate = new Date();
        newEndDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth(), newEndDate.getDate());
        let one_day = 1000 * 60 * 60 * 24;
        let result = Math.ceil((newEndDate.getTime()-newStartDate.getTime())/(one_day))

        if (result == 0) {
            return true;
        } else {
            return false;
        }
    }

    const getDay = (item: any) => {
        let newStartDate = new Date(item['dt'] * 1000);

        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

        if (isToday(item)) {
            return 'Today';
        } else {
            return days[newStartDate.getDay()];
        }
    }
    
    const getIcon = (item: any) => {
        let iconRq = require('./../../assets/images/01.png');

        switch (item['weather'][0]['icon'].substring(0, 2)) {
            case "01":
                iconRq = require('./../../assets/images/01.png');
                break;
            case "02":
                iconRq = require('./../../assets/images/02.png');;
                break;
            case "03":
                iconRq = require('./../../assets/images/03.png');
                break;
            case "04":
                iconRq = require('./../../assets/images/04.png');;
                break;
            case "09":
                iconRq = require('./../../assets/images/09.png');
                break;
            case "10":
                iconRq = require('./../../assets/images/10.png');
                break;
            case "11":
                iconRq = require('./../../assets/images/11.png');
                break;
            case "13":
                iconRq = require('./../../assets/images/13.png');
                break;
            case "50":
                iconRq = require('./../../assets/images/50.png');;
                break;
            default:
                iconRq = require('./../../assets/images/01.png');
                break;
        }
        return iconRq;
    }
    
    const getMin = (item: any) => {
        return Math.round(item['temp']['min']).toString();
    }

    const getMax = (item: any) => {
        return Math.round(item['temp']['max']).toString();
    }

    if(started == 0) {
        started = started + 1;
        getLocation();
    };

    return (
        <View style={styles.weatherContainer}>
            <View style={styles.goBack}>
                <Button
                    onPress={() => navigation.goBack()}
                    buttonStyle={styles.button}
                    icon={
                        <Icon
                        name="arrow-left"
                        size={30}
                        color="#343434"
                        />
                    }
                />
            </View>
            <View style={styles.rowContainer}>
                <ScrollView style={styles.cardsContainer}>
                    { list.map((l, i) => (
                        <View key={i} style={styles.cardHour}>
                            <Text style={styles.cardTemp}>{getDay(l)}</Text>
                            <View style={styles.cardRow}>
                                <Image
                                    style={styles.cardIcon}
                                    source={getIcon(l)}
                                    />
                                <View>
                                    <Text style={styles.cardTime}>{getMin(l)}˚</Text>
                                    <Text style={styles.cardTime}>{getMax(l)}˚</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    weatherContainer: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#F7F7FF',
    },
    goBack: {

    },
    button: {
        marginTop: 20,
        marginLeft: 20,
        width: 50,
        backgroundColor: 'transparent',
    },
    rowContainer: {
        height: Dimensions.get('window').height - 110,
        width: Dimensions.get('window').width - 20,
        marginTop: 20,
    },
    cardsContainer: {
        width: Dimensions.get('window').width - 20,
        height: 230,
        // marginTop: 30,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
    },
    cardHour: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: Dimensions.get('window').width - 40,
        padding: 20,
        marginRight: 10,
        borderRadius: 15,
        backgroundColor: '#D0E1F0',
        marginBottom: 10,
    },
    cardTemp: {
        paddingLeft: 5,
        fontSize: 25,
        color: '#343434',
    },
    cardIcon: {
        height: 45,
        width: 45,
    },
    cardTime: {
        fontSize: 20,
        color: '#343434',
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 30, 
    },
    cardRow: {
        flexDirection: 'row',
        width: 90,
        justifyContent: 'space-between',
    },
});

export default NextDays;