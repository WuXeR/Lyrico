import * as React from 'react';
import { View, Image, FlatList, RefreshControl } from 'react-native';
import { Searchbar, Card, IconButton, Subheading } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default () => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [currentSearch, setCurrentSearch] = React.useState("");
    const [currentSearchOffset, setCurrentSearchOffset] = React.useState(0);
    const [songs, setSongs] = React.useState([]);
    const [lyricsSearch, setLyricsSearch] = React.useState(false);

    const navigation = useNavigation();

    const fetchNewSongs = (search) => {
        setRefreshing(true);

        if(search == "") {
            setRefreshing(false);
            setSongs([]);
            return;
        }

        if(!lyricsSearch) {
            console.log(`New Search: ${search}`);
            fetch(`https://api.imwux.me/lyrico/search/${search}/0`)
                .then((res) => res.json())
                .then((data) => {
                    setSongs(data);
                    setRefreshing(false);
                });
        } else {
            fetch(`https://api.imwux.me/lyrico/searchlyrics/${search}`)
                .then((res) => res.json())
                .then((data) => {
                    setSongs(data);
                    setRefreshing(false);
                });
        }
        setCurrentSearch(search);
        setCurrentSearchOffset(0);
    }

    const fetchMoreSongs = () => {
        if(currentSearch == "" || lyricsSearch)
            return;
        setRefreshing(true);
        fetch(`https://api.imwux.me/lyrico/search/${currentSearch}/${currentSearchOffset + 20}`)
            .then((res) => res.json())
            .then((data) => {
                setSongs([...songs, ...data]);
                setRefreshing(false);
            });
        setCurrentSearchOffset(currentSearchOffset + 20);
    }

    return (
        <View style={{
            paddingVertical: 20,
            paddingHorizontal: 10,
        }}> 
            <Searchbar 
                placeholder={lyricsSearch ? "Search Song With Lyrics" : "Search Song"}
                icon={lyricsSearch ? "text" : "music-note"} style={{marginBottom: 10}}
                onEndEditing={(e) => {
                    fetchNewSongs(e.nativeEvent.text);
                }}
                onIconPress={() => {
                    setLyricsSearch(!lyricsSearch);
                    setCurrentSearch("");
                    setCurrentSearchOffset(0);
                }}
                style={lyricsSearch ? {paddingVertical: 5} : {}}
                multiline={lyricsSearch}
            />
            <FlatList
                style={{height: "95%"}}
                refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                        fetchNewSongs(currentSearch);
                    }}
                />}
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
                data={songs}
                onEndReached={() => {
                    fetchMoreSongs();
                }}
                ListEmptyComponent={
                    <Subheading style={{
                        textAlign: "center",
                        marginTop: 10
                    }}>
                        No songs found
                    </Subheading>
                }
            />
        </View>
    );

}