/*
OverviewScreen.js
10. January 2023

Default Screen

Author:
Nilusink
*/
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { useEffect, useState } from "react";
import { getWeatherStations } from "./requesters";
import { StationBox } from "./uiElements";


export default function DefaultScreen({navigation}) {
    let [stations, setStations] = useState([]);

    useEffect(() => {
        getWeatherStations(setStations);
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
                style={{marginTop: 20, width: "100%"}}
                contentContainerStyle={{alignItems: "center"}}
                data={stations}
                renderItem={(x) => {
                    return (
                        <StationBox
                            data={x.item}
                            navigation={navigation}
                            clickable={true}
                        />
                    )
                }}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#113',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: "100%",
        height: "100%",
    },
});
