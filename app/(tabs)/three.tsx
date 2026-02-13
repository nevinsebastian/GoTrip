import BellIcon from '@/assets/images/bell.svg';
import { IconButton, Input, Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { borderRadius, colors, spacing } from '@/constants/DesignTokens';
import React, { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Light peach/orange background from Figma Ticket details screen
const TICKETS_BG = '#FFF8F6';

type TabKey = 'active' | 'past';

export default function TicketsScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const { width, isMobile, isTablet } = useResponsive();
  const { height } = useWindowDimensions();

  const contentPadding = isMobile ? spacing['4'] : isTablet ? spacing['5'] : spacing['6'];
  const bellIconSize = isMobile ? 24 : isTablet ? 26 : 28;

  const emptyState = activeTab === 'active'
    ? {
        title: 'No Active tickets found',
        subtitle: 'Your active tickets & booking details will appear here.',
      }
    : {
        title: 'No Bookings yet',
        subtitle: 'Your past tickets & booking details will appear here.',
      };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: TICKETS_BG }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: contentPadding }]}>
        <IconButton
          icon="chevron-back"
          size={isMobile ? 24 : 26}
          color={colors.primary}
          onPress={() => {}}
        />
        <Text variant="header" color="primaryBrand" style={styles.headerTitle}>
          Ticket details
        </Text>
        <Pressable
          style={styles.bellWrap}
          onPress={() => {}}
          hitSlop={12}
          accessibilityLabel="Notifications"
        >
          <BellIcon width={bellIconSize} height={bellIconSize} />
        </Pressable>
      </View>

      {/* Search bar */}
      <View style={[styles.searchWrap, { paddingHorizontal: contentPadding }]}>
        <Input
          variant="search"
          showSearchIcon
          placeholder="Search your tickets"
          placeholderTextColor={colors.text.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tabs */}
      <View style={[styles.tabsRow, { paddingHorizontal: contentPadding }]}>
        <Pressable
          style={styles.tab}
          onPress={() => setActiveTab('active')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'active' }}
        >
          <Text
            variant="bodySemibold"
            style={[styles.tabLabel, activeTab === 'active' && styles.tabLabelActive]}
          >
            Active tickets
          </Text>
          {activeTab === 'active' && <View style={styles.tabUnderline} />}
        </Pressable>
        <Pressable
          style={styles.tab}
          onPress={() => setActiveTab('past')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'past' }}
        >
          <Text
            variant="bodySemibold"
            style={[styles.tabLabel, activeTab === 'past' && styles.tabLabelActive]}
          >
            Past bookings
          </Text>
          {activeTab === 'past' && <View style={styles.tabUnderline} />}
        </Pressable>
      </View>
      <View style={[styles.tabsDivider, { marginHorizontal: contentPadding }]} />

      {/* Content - empty state */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.emptyStateWrap,
          {
            minHeight: height * 0.35,
            paddingHorizontal: contentPadding,
            maxWidth: width >= 1024 ? 600 : undefined,
            alignSelf: width >= 1024 ? 'center' : 'stretch',
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.emptyState}>
          <Text variant="heading2" style={styles.emptyTitle}>
            {emptyState.title}
          </Text>
          <Text variant="body" style={styles.emptySubtitle}>
            {emptyState.subtitle}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingVertical: spacing['2'],
  },
  headerTitle: {
    flex: 1,
    marginLeft: spacing['1'],
  },
  bellWrap: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  searchWrap: {
    marginBottom: spacing['4'],
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingTop: spacing['2'],
    gap: spacing['4'],
  },
  tab: {
    paddingVertical: spacing['2'],
    paddingHorizontal: spacing['2'],
    minHeight: 44,
    justifyContent: 'flex-end',
  },
  tabLabel: {
    color: colors.text.caption,
    fontSize: 15,
  },
  tabLabelActive: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  tabUnderline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  tabsDivider: {
    height: 1,
    backgroundColor: colors.border.light,
  },
  scroll: {
    flex: 1,
  },
  emptyStateWrap: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing['8'],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['6'],
  },
  emptyTitle: {
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing['2'],
  },
  emptySubtitle: {
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
  },
});
