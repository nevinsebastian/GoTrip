import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import TabActivitiesIcon from '@/assets/images/home-figma/tab-activities.svg';
import TabGlampingIcon from '@/assets/images/home-figma/tab-glamping.svg';
import TabHotelsIcon from '@/assets/images/home-figma/tab-hotels.svg';
import TabPackagesIcon from '@/assets/images/home-figma/tab-packages.svg';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { useHomeScale } from '@/src/components/home/useHomeScale';

const CATEGORY_TABS: Array<{
  id: HomeCategoryTab;
  label: string;
  Icon: React.ComponentType<{ width?: number; height?: number }>;
}> = [
  { id: 'hotels', label: 'Hotels', Icon: TabHotelsIcon },
  { id: 'packages', label: 'Packages', Icon: TabPackagesIcon },
  { id: 'glamping', label: 'Glamping', Icon: TabGlampingIcon },
  { id: 'activities', label: 'Activities', Icon: TabActivitiesIcon },
];

export function HomeCategoryTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: HomeCategoryTab;
  onTabChange: (tab: HomeCategoryTab) => void;
}) {
  const { s } = useHomeScale();

  return (
    <View style={[styles.tabsShell, { padding: s(4), borderRadius: s(12), gap: s(2), width: '100%' }]}>
      {CATEGORY_TABS.map((tab) => {
        const selected = tab.id === activeTab;
        const tabInner = (
          <>
            <View
              style={[
                styles.tabIconBox,
                {
                  width: s(18),
                  height: s(18),
                  borderRadius: s(2),
                  backgroundColor: selected ? colors.surface.white : 'transparent',
                },
              ]}
            >
              <tab.Icon width={s(11)} height={s(11)} />
            </View>
            <Text
              style={[
                styles.tabLabel,
                {
                  fontSize: s(9),
                  lineHeight: s(12),
                  color: selected ? colors.surface.white : colors.text.primary,
                },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {tab.label}
            </Text>
          </>
        );

        if (selected) {
          return (
            <View
              key={tab.id}
              style={[
                styles.tabSlot,
                styles.tabSelectedRing,
                {
                  borderRadius: s(10),
                  padding: s(2),
                  borderWidth: s(2),
                },
              ]}
            >
              <Pressable
                style={[
                  styles.tabButton,
                  styles.tabButtonSelected,
                  {
                    width: '100%',
                    paddingVertical: s(6),
                    paddingHorizontal: s(4),
                    borderRadius: s(8),
                    gap: s(2),
                  },
                ]}
                onPress={() => onTabChange(tab.id)}
                accessibilityState={{ selected: true }}
              >
                {tabInner}
              </Pressable>
            </View>
          );
        }

        return (
          <Pressable
            key={tab.id}
            style={[
              styles.tabSlot,
              styles.tabButton,
              {
                paddingVertical: s(6),
                paddingHorizontal: s(4),
                borderRadius: s(8),
                gap: s(2),
                backgroundColor: colors.surface.white,
                borderWidth: 1,
                borderColor: 'rgba(28, 32, 36, 0.2)',
              },
            ]}
            onPress={() => onTabChange(tab.id)}
            accessibilityState={{ selected: false }}
          >
            {tabInner}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsShell: {
    flexDirection: 'row',
    backgroundColor: colors.surface.white,
  },
  tabSlot: {
    flex: 1,
    minWidth: 0,
  },
  tabSelectedRing: {
    borderColor: colors.accent.main,
    backgroundColor: colors.surface.white,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonSelected: {
    backgroundColor: colors.accent.main,
  },
  tabIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.01,
    textAlign: 'center',
    width: '100%',
  },
});
