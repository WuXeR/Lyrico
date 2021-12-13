import * as React from 'react';
import { ScrollView, RefreshControl } from 'react-native'
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default () => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [status, setStatus] = React.useState(
        <Text><MaterialCommunityIcons name="circle" color="#FFA500" /> Loading API Status...</Text>
    );

    const fetchStatus = () => {
        setRefreshing(true);
        fetch("https://api.imwux.me/lyrico/status")
            .then((res) => res.json())
            .then(() => {
                setStatus(
                    <Text><MaterialCommunityIcons name="circle" color="#00FF00" /> Online</Text>
                );
                setRefreshing(false);
            })
            .catch(() => {
                setStatus(
                    <Text><MaterialCommunityIcons name="circle" color="#FF0000" /> Offline</Text>
                );
                setRefreshing(false);
            });
    }

    React.useEffect(() => {
        fetchStatus();
    }, []);

    return (
        <ScrollView style={{padding: 20}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchStatus} />}>
            {status}
        </ScrollView>
    );

}