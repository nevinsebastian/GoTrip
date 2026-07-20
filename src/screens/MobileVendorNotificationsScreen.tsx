import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { useVendorNotifications, useMarkAllNotificationsRead, useMarkNotificationRead } from '@/src/hooks/useVendorNotifications';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const NOTIF_BLUE = '#2563EB';

function notifIcon(category?: string): string {
  switch (category) {
    case 'payment': return 'wallet-outline';
    case 'review': return 'star-outline';
    case 'system': return 'information-circle-outline';
    default: return 'calendar-outline';
  }
}

export function MobileVendorNotificationsScreen() {
  const { notifications, isLoading, refetch } = useVendorNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAll } = useMarkAllNotificationsRead();

  const handleMarkAllRead = () => markAll();

  const handlePress = (id: string) => {
    markRead(id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.page}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.topTitle}>Notifications</Text>
          <Pressable onPress={handleMarkAllRead} hitSlop={8}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <ActivityIndicator color={NOTIF_BLUE} style={{ marginTop: 40 }} />
          ) : notifications.length === 0 ? (
            <Text style={styles.emptyText}>No notifications.</Text>
          ) : (
            notifications.map((n) => {
              const isRead = n.isRead ?? n.read ?? false;
              return (
                <Pressable
                  key={n.id}
                  style={[styles.notificationCard, isRead && styles.notificationCardRead]}
                  onPress={() => handlePress(n.id)}
                >
                  <View style={styles.iconWrap}>
                    <Ionicons
                      name={notifIcon(n.category) as any}
                      size={18}
                      color={NOTIF_BLUE}
                    />
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{n.title ?? 'Notification'}</Text>
                    <Text style={styles.cardBodyText}>{n.message ?? n.body ?? ''}</Text>
                    {n.createdAt ? (
                      <Text style={styles.cardDate}>{n.createdAt}</Text>
                    ) : null}
                  </View>
                  {!isRead ? <View style={styles.unreadDot} /> : null}
                </Pressable>
              );
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
  },
  topTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['2'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  markAllText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: NOTIF_BLUE,
  },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['4'],
    gap: 12,
  },
  emptyText: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: 'rgba(28, 32, 36, 0.5)',
    textAlign: 'center',
    marginTop: 40,
  },
  notificationCard: {
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.xl,
    padding: 14,
    backgroundColor: colors.surface.white,
  },
  notificationCardRead: {
    backgroundColor: '#F8F9FA',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  cardBodyText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    color: 'rgba(28, 32, 36, 0.65)',
    lineHeight: 16,
  },
  cardDate: {
    fontFamily: typography.fontFamily.text,
    fontSize: 10,
    color: 'rgba(28, 32, 36, 0.4)',
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: NOTIF_BLUE,
    alignSelf: 'center',
    flexShrink: 0,
  },
});
