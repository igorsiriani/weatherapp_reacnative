import { CompositeNavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, Pressable, Alert } from 'react-native';
import RNLocation from 'react-native-location';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './RootStackPrams';

RNLocation.configure({});

let started = 0;

type authScreenProp = StackNavigationProp<RootStackParamList, 'Today'>;

const Today = ({weather, temperature} : {weather:any, temperature:any}) => { 
    
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

            var weatherTemp = json['current']['weather'][0]['description'];
            weatherTemp = weatherTemp.split(' ').map((str: string) => str[0].toUpperCase() + str.substring(1)).join(' ');

            let tempHourly = json['hourly'].filter(
                    (time: any) => isToday(time)
                ).map((i: any) => i);

            let iconRq = getIcon(json['current']);
        
            // console.error(Math.round(json['current']['temp']).toString());
            setTemp(Math.round(json['current']['temp']).toString());
            setWeatherText(weatherTemp);
            setIcon(iconRq);
            setMin(Math.round(json['daily'][0]['temp']['min']).toString());
            setMax(Math.round(json['daily'][0]['temp']['max']).toString());
            setList(tempHourly);

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

    const getTemp = (item: any) => {
        return Math.round(item['temp']).toString();
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
    
    const getHour = (item: any) => {
        var t = new Date(item['dt'] * 1000);

        var hours = ('0' + t.getHours()).slice(-2);
        var minutes = ('0' + t.getMinutes()).slice(-2);
        var formatted = hours + ':' + minutes;
        return formatted;
    }

    if(started == 0) {
        started = started + 1;
        getLocation();
    };

    return (
        <View style={styles.weatherContainer}>
            <View style={styles.weather}>
                <Image
                    style={styles.weatherIcon}
                    source={icon}
                />
                <Text style={styles.tempText}>{temp}˚</Text>
                <Text style={styles.weatherText}>{weatherText}</Text>
                <View style={styles.weatherMinMax}>
                    <Text style={styles.minMax}>{min}˚</Text> 
                    <Text style={styles.minMax}>{max}˚</Text>
                </View>
            </View>
            <View style={styles.rowContainer}>
                <ScrollView horizontal={true} style={styles.cardsContainer}>
                    { list.map((l, i) => (
                        <View key={i} style={styles.cardHour}>
                            <Text style={styles.cardTemp}>{getTemp(l)}˚</Text>
                            <Image
                                style={styles.cardIcon}
                                source={getIcon(l)}
                            />
                            <Text style={styles.cardTime}>{getHour(l)}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <View style={styles.navigation}>
                <Button
                    title='Tomorrow'
                    onPress={() => navigation.navigate('Tomorrow')}
                />
                <Button
                    title='7 Days'  
                    onPress={() => navigation.navigate('NextDays')}
                />
            </View>
        </View>
    );
};

const Button = ( {onPress, title} : {onPress: any, title: any} ) => {
    return (
      <Pressable style={btn.button} onPress={onPress}>
        <Text style={btn.text}>{title}</Text>
      </Pressable>
    );
}

const btn = StyleSheet.create({
    button: {
        width: 110,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 30,
        elevation: 3,
        backgroundColor: '#5F5980',
    },
    text: {
        width: 80,  
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
        textAlign: 'center'
    },
});

const styles = StyleSheet.create({
    weatherContainer: {
        flex: 1,
        width: Dimensions.get('window').width,
        backgroundColor: '#F7F7FF',
    },
    weather: {
        // height: 200,
        // flex: 1,
        alignItems: 'center',
        backgroundColor: '#D0E1F0',
        marginLeft: 70,
        marginRight: 70,
        marginTop: 40,
        marginBottom: 15,
        borderRadius: 15,
        padding: 20,
        paddingBottom: 15,
    },
    weatherIcon: {
        width: 75,
        height: 75,
    },
    tempText: {
        paddingLeft: 15,
        paddingTop: 10,
        fontSize: 55,
        color: '#343434'
    },
    weatherText: {
        fontSize: 20,
        color: '#343434'
    },
    weatherMinMax: {
        flexDirection: 'row',
        marginTop: 20,
    },
    minMax: {
        fontSize: 30,
        color: '#343434',
        marginLeft: 25,
        marginRight: 25,
        // marginBottom: -10
    },
    rowContainer: {
        height: 200,
        marginTop: 20,
    },
    cardsContainer: {
        // flex: 1,
        width: Dimensions.get('window').width - 20,
        height: 230,
        // marginTop: 30,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
    },
    cardHour: {
        alignItems: 'center',
        width: 120,
        padding: 20,
        marginRight: 10,
        borderRadius: 15,
        backgroundColor: '#D0E1F0'
    },
    cardTemp: {
        paddingLeft: 5,
        fontSize: 25,
        color: '#343434',
    },
    cardIcon: {
        marginTop: 25,
        height: 35,
        width: 35,
    },
    cardTime: {
        paddingTop: 15,
        fontSize: 20,
        color: '#343434',
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 30, 
    },
});

export default Today;