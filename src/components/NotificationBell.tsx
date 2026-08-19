import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import api from '../../lib/api';

export default function NotificationBell() {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notification/unread-count');
      // The endpoint returns a raw number
      setUnreadCount(Number(response.data) || 0);
    } catch (err) {
      console.error('Failed to fetch unread notifications count', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
    }, [])
  );

  const handlePress = () => {
    router.push('/notifications' as any);
  };

  const displayCount = unreadCount > 9 ? '9+' : unreadCount.toString();

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      className="relative w-10 h-10 items-center justify-center"
      activeOpacity={0.7}
    >
      <Feather name="bell" size={24} color="#1b1c1c" />
      {unreadCount > 0 && (
        <View className="absolute top-1 right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
          <Text className="text-white text-[10px] font-bold">{displayCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
