import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);

    const setSession = async (token) => {
        await AsyncStorage.setItem('userToken', token);
        setUserToken(token);
    };

    const checkSession = async () => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            return true;
        } else {
            setUserToken(null);
            await AsyncStorage.removeItem('currentUserId');
            return false;
        }
    };

    const clearSession = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('currentUserId');
        setUserToken(null);
    };

    return (
        <SessionContext.Provider
            value={{
                userToken,
                setSession,
                checkSession,
                clearSession,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
