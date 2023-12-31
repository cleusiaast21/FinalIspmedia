import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs, startAt, endAt } from 'firebase/firestore';
import { FIREBASE_STORAGE, FIREBASE_DB } from '../../FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function Search() {
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [audios, setAudios] = useState([]);
    const [artists, setArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        try {
            setIsLoading(true);

            const videosRef = collection(FIREBASE_DB, 'videos');
            const querySnapshot = await getDocs(
                query(videosRef, where('title', '>=', searchText), where('title', '<=', searchText + '\uf8ff'))
            );

            const results = [];
            querySnapshot.forEach((doc) => {
                const videoData = doc.data();
                results.push(videoData);
            });

            setSearchResults(results);

            const results2 = [];

            const artistsRef = collection(FIREBASE_DB, 'pessoa');
            const querySnapshot2 = await getDocs(
                query(artistsRef, where('name', '>=', searchText), where('name', '<=', searchText + '\uf8ff'))
            );

            querySnapshot2.forEach((doc) => {
                const artistData = doc.data();
                results2.push(artistData);
            });

            setArtists(results2);

            const results1 = [];

            const audiosRef = collection(FIREBASE_DB, 'audios');
            const querySnapshot1 = await getDocs(
                query(audiosRef, where('title', '>=', searchText), where('title', '<=', searchText + '\uf8ff'))
            );

            querySnapshot1.forEach((doc) => {
                const audioData = doc.data();
                results1.push(audioData);
            });

            setAudios(results1);
        } catch (error) {
            console.log('Error fetching person data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (searchText !== '') {
            handleSearch(); // Trigger the search when searchText is not empty
        } else {
            setSearchResults([]); // Clear search results when searchText is empty
            setAudios([]);
            setArtists([]);
        }
    }, [searchText]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pesquisa</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua pesquisa"
                    value={searchText}
                    placeholderTextColor="grey"
                    onChangeText={setSearchText}
                />
                <TouchableOpacity style={styles.iconSearchContainer} onPress={handleSearch}>
                    <Ionicons style={styles.iconSearch} name="search" size={25} color="pink" />
                </TouchableOpacity>
            </View>

            {searchText !== '' && (
                <>
                    <Text style={{ color: 'pink', fontSize: 25, fontWeight: 'bold' }}>Vídeos</Text>

                    <View style={styles.resultsContainer}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="pink" />
                        ) : (
                            searchResults.map((video, index) => <Text style={{ color: 'grey', fontSize: 15, fontWeight: 'bold', opacity: 0.5 }} key={index}>{video.title}</Text>)
                        )}
                    </View>

                    <Text style={{ color: 'pink', fontSize: 25, fontWeight: 'bold', marginTop: 10 }}>Áudios</Text>

                    <View style={styles.resultsContainer}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="pink" />
                        ) : (
                            audios.map((audio, index) => <Text style={{ color: 'grey', fontSize: 15, fontWeight: 'bold', opacity: 0.5 }} key={index}>{audio.title}</Text>)
                        )}
                    </View>

                    <Text style={{ color: 'pink', fontSize: 25, fontWeight: 'bold', marginTop: 10 }}>Usuários</Text>

                    <View style={styles.resultsContainer}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="pink" />
                        ) : (
                            artists.map((artist, index) => (
                                <Text key={index} style={{ color: 'grey', fontSize: 15, fontWeight: 'bold', opacity: 0.5, marginBottom: 15 }}>
                                    {artist.name} {artist.surname}
                                </Text>
                            ))
                        )}
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
    },
    iconSearchContainer: {
        position: 'absolute',
        top: 6, // Adjust the positioning as needed
        right: 10, // Adjust the positioning as needed
    },
    title: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'grey',
        opacity: 0.5,
        paddingTop: 15,
        marginTop: '15%',
        marginBottom: 10,
    },
    inputContainer: {
        marginBottom: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'pink',
        borderRadius: 20,
        paddingHorizontal: 10,
    },
    button: {
        width: '80%',
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'pink',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    resultsContainer: {
        marginTop: 20,
    },
});
