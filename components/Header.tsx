import * as React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { UserCircleIcon, CogIcon } from './icons';
import { useNavigation } from '@react-navigation/native';
import { MainScreen, AppNavigationProp } from '../types';

const Header: React.FC = () => {
    const navigation = useNavigation<AppNavigationProp>();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.navigate(MainScreen.Profile as any)}
                    style={styles.button}
                >
                    <UserCircleIcon color="#4B5563" width={32} height={32} />
                </TouchableOpacity>
                <Text style={styles.title}>PharmaConnect</Text>
                <TouchableOpacity style={styles.button}>
                    <CogIcon color="#4B5563" width={32} height={32} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2, // for Android shadow
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    button: {
        padding: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
});

export default Header;