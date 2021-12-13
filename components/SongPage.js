import * as React from 'react';
import { View, ScrollView, ImageBackground } from 'react-native';
import { Headline, Subheading, Surface, IconButton, Text } from 'react-native-paper';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default ({ route }) => {
    const [previewAudio, setPreviewAudio] = React.useState(new Audio.Sound());
    const [playingPreviewAudio, setPlayingPreviewAudio] = React.useState(false);
    const [lyrics, setLyrics] = React.useState("");
    const [isFavorite, setIsFavoríte] = React.useState(false);

    const navigation = useNavigation();
    const { meta } = route.params;

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            previewAudio.getStatusAsync()
                .then((status) => {
                    if(status.isPlaying)
                        previewAudio.stopAsync();
                });
        });
        return unsubscribe;
    }, [navigation]);

    React.useEffect(() => {
        try {
            AsyncStorage.getItem('@favorites')
                .then((jsonValue) => {
                    if(jsonValue == null)
                        return;
    
                    var data = JSON.parse(jsonValue);
                    if(data[meta.id])
                        setIsFavoríte(true);
                });
        } catch(err) {
            console.log(err);
        }
    }, [])

    const playPreviewAudio = (event) => {
        if(!playingPreviewAudio) {
            previewAudio.loadAsync({uri: meta.preview})
                .then(() => {
                    previewAudio.playAsync();                    
                });
        } else {
            previewAudio.stopAsync();
            previewAudio.unloadAsync();
        }
        setPlayingPreviewAudio(!playingPreviewAudio);
    }

    React.useEffect(() => {
        fetch(`https://api.imwux.me/lyrico/get/${meta.id}`)
            .then((res) => res.json())
            .then((data) => {
                setLyrics(data.lyrics);
            });
    }, []);

    return (
        <ScrollView style={{paddingHorizontal: 10}}>
            <Surface style={{borderRadius: 5, padding: 10}}>
                <View style={{
                    width: "100%",
                    paddingVertical: 10,
                    paddingHorizontal: 50
                }}>
                    <ImageBackground style={{
                        width: "100%",
                        aspectRatio: 1
                    }} source={{uri: meta.cover}}>
                        <IconButton style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            margin: 0,
                            borderRadius: 0
                        }} color={playingPreviewAudio ? "#1ed760" : "#fff"} icon="spotify" size={80} onPress={playPreviewAudio}/>
                    </ImageBackground>
                </View>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "center"
                }}>
                    <View>
                        <Headline>{meta.name}</Headline>
                        <Subheading>{meta.artist}</Subheading>
                    </View>
                    <IconButton icon={isFavorite ? "heart" : "heart-outline"} color={isFavorite ? "#fc1c03" : "#fff"} size={40} onPress={() => {
                        try {
                            AsyncStorage.getItem('@favorites')
                                .then((jsonValue) => {
                                    var data = jsonValue == null ? {} : JSON.parse(jsonValue);
                                    if(isFavorite) {
                                        delete data[meta.id];
                                        AsyncStorage.setItem('@favorites', JSON.stringify(data))
                                            .then(() => setIsFavoríte(false));
                                    } else {
                                        data[meta.id] = meta;
                                        AsyncStorage.setItem('@favorites', JSON.stringify(data))
                                            .then(() => setIsFavoríte(true));
                                    }
                                });
                        } catch(err) {
                            console.log(err);
                        }
                    }}/>
                </View>
            </Surface>
            <Text style={{
                marginVertical: 10,
                fontSize: 15
            }}>{lyrics}</Text>
        </ScrollView>
    );
}