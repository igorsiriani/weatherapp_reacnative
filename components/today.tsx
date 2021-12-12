import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, Pressable, Alert } from 'react-native';
import RNLocation from 'react-native-location';

RNLocation.configure({});

const Today = ({weather, temperature} : {weather:any, temperature:any}) => { 

    let [viewLocation, isViewLocation] = useState<Location | null>();

    let temp = '--';
    let icon = '01';
    let weatherText = 'Overcast Clouds';
    let min = '10';
    let max = '30';

    let list = ['1', '2', '3', '4', '5'];

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

            if (location) {
                getWeather(location.latitude.toString(), location.longitude.toString());
            }
        } else {
            location = await RNLocation.getLatestLocation({timeout: 5000})
            console.log(location)
            if (location) {
                getWeather(location.latitude.toString(), location.longitude.toString());
            }
        }
    }

    const getWeather = async (lat: string, long: string) => {
        try {
            const response = await fetch(
                'http://api.openweathermap.org/data/2.5/onecall?units=metric&lat=' + lat + '&lon=' + long + '&APPID=e0d0ed6241a6e7bd2380a3cc396c6707'
            );
            const json = await response.json();

            temp = json['current']['temp'].round().toString();

        } catch (error) {
            console.error(error);
        }
    }

    if (weather != null) {
        return (
            <View style={styles.weatherContainer}>
                <View style={styles.weather}>
                    <Image
                        style={styles.weatherIcon}
                        source={require('./../assets/images/' + icon + '.png')}
                    />
                    <Text style={styles.tempText}>{temp}˚</Text>
                    <Text style={styles.weatherText}>{weatherText}</Text>
                    <View style={styles.weatherMinMax}>
                        <Text style={styles.minMax}>{min}˚</Text> 
                        <Text style={styles.minMax}>{max}˚</Text>
                    </View>
                </View>
                <View>
                    <ScrollView horizontal={true} style={styles.cardsContainer}>
                        { list.map((l, i) => (
                            <View key={i} style={styles.cardHour}>
                                <Text style={styles.cardTemp}>{temp}˚</Text>
                                <Image
                                    style={styles.cardIcon}
                                    source={require('./../assets/images/' + icon + '.png')}
                                />
                                <Text style={styles.cardTime}>01:00</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.navigation}>
                    <Button
                        title='Tomorrow'
                        onPress={() => {}}
                    />
                    <Button
                        title='7 Days'  
                        onPress={() => {}}
                    />
                </View>
            </View>
        );
    } else {
        return (
            <View>
                <Text>Oh no, something went wrong</Text>
            </View>
        )
    };
};

const Button = ( {onPress, title} : {onPress: any, title: any} ) => {
    return (
      <Pressable style={btn.button} onPress={onPress}>
        <Text style={btn.text}>{title}</Text>
      </Pressable>
    );
}

const ButtonNext = ( {props} : {props: any} ) => {
    const { onPress, title = 'Save' } = props;
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
        backgroundColor: '#F7F7FF',
    },
    weather: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#D0E1F0',
        marginLeft: 90,
        marginRight: 90,
        marginTop: 70,
        marginBottom: 15,
        borderRadius: 15,
        padding: 20,
    },
    weatherIcon: {
        width: 75,
        height: 75,
    },
    tempText: {
        paddingLeft: 15,
        paddingTop: 15,
        fontSize: 55,
        color: '#343434'
    },
    weatherText: {
        fontSize: 20,
        color: '#343434'
    },
    weatherMinMax: {
        flexDirection: 'row'
    },
    minMax: {
        fontSize: 30,
        color: '#343434',
        marginLeft: 25,
        marginTop: 25,
        marginRight: 25,
        marginBottom: 10,
    },
    cardsContainer: {
        flex: 1,
        width: Dimensions.get('window').width - 20,
        height: 175,
        marginTop: 30,
        marginBottom: 20,
        marginLeft: 20,
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