import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subheading, Card, IconButton, Button } from 'react-native-paper';
import { Image, FlatList, View } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default () => {
    const [favorites, setFavorites] = React.useState([]);

    const navigation = useNavigation();

    const refreshFavorites = () => {
        try {
            AsyncStorage.getItem('@favorites')
                .then((jsonValue) => {
                    setFavorites(jsonValue == null ? [] : Object.values(JSON.parse(jsonValue)));
                });
        } catch(err) {
            console.log(err);
        }
    }

    useFocusEffect(() => {
        refreshFavorites();
    });

    React.useEffect(() => {
        refreshFavorites();
    }, [])

    return (
        <View style={{
            paddingHorizontal: 10,
        }}>
            <Button onPress={() => {
                AsyncStorage.setItem("@favorites", JSON.stringify({}));
                refreshFavorites();
            }}>Clear Favorites</Button>
            <FlatList
                style={{height: "95%"}}
                renderItem={({item}) => (
                    <Card key={item.id} style={{
                        marginVertical: 5
                    }}>
                        <Card.Title title={item.name} subtitle={item.artist}
                            left={() => <Image style={{width: "100%", height: "100%"}} source={{uri: item.cover}} />}
                            right={() => <IconButton icon="open-in-new" onPress={() => {
                                navigation.navigate("Song", {
                                    meta: item
                                });
                            }}/>}
                        />
                    </Card>
                )}
                keyExtractor={track => track.id}
                data={favorites}
                ListEmptyComponent={
                    <Subheading style={{
                        textAlign: "center",
                        marginTop: 40
                    }}>
                        No Favorites
                    </Subheading>
                }
            />
        </View>
    );

}