import BellIcon from '@/assets/images/bell.svg';
import { IconButton, Input, Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { borderRadius, colors, spacing } from '@/constants/DesignTokens';
import type { Category } from '@/src/api/types';
import { useCategoriesByType } from '@/src/hooks/useCategoriesByType';
import { useListings } from '@/src/hooks/useListings';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TICKETS_BG = '#FFF8F6';
const ResortImage = require('../assets/images/resort.jpg');

export default function ResortsScreen() {
  const { isMobile, isTablet, width } = useResponsive();
  const contentPadding = isMobile ? spacing['4'] : isTablet ? spacing['5'] : spacing['6'];
  const maxWidth = width >= 1024 ? 600 : undefined;
  const bellIconSize = isMobile ? 24 : isTablet ? 26 : 28;

  const [query, setQuery] = useState('');
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  const { data: categoriesRes } = useCategoriesByType('hotel', true);
  const root = categoriesRes?.data?.[0];
  const children: Category[] = root?.children ?? [];

  const categoryId = root?.id;

  const { data: listingsRes } = useListings(
    { page: 1, limit: 20, category_id: categoryId },
    Boolean(categoryId),
  );

  const listings = listingsRes?.data ?? [];
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return listings;
    return listings.filter((l) => l.title.toLowerCase().includes(q));
  }, [listings, query]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: TICKETS_BG }]} edges={['top']}>
      <View
        style={[
          styles.header,
          { paddingHorizontal: contentPadding, maxWidth, alignSelf: maxWidth ? 'center' : 'stretch' },
        ]}
      >
        <IconButton
          icon="chevron-back"
          size={isMobile ? 24 : 26}
          color={colors.primary}
          onPress={() => router.back()}
        />
        <Text variant="header" color="primaryBrand" style={styles.headerTitle}>
          Resorts
        </Text>
        <Pressable style={styles.bellWrap} accessibilityLabel="Notifications">
          <BellIcon width={bellIconSize} height={bellIconSize} />
        </Pressable>
      </View>

      <View
        style={[
          styles.searchWrap,
          { paddingHorizontal: contentPadding, maxWidth, alignSelf: maxWidth ? 'center' : 'stretch' },
        ]}
      >
        <Input
          variant="search"
          showSearchIcon
          placeholder="Search resorts"
          placeholderTextColor={colors.text.placeholder}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {children.length ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.chipsRow,
            { paddingHorizontal: contentPadding, maxWidth, alignSelf: maxWidth ? 'center' : 'stretch' },
          ]}
        >
          <Pressable
            style={[styles.chip, !selectedChild && styles.chipActive]}
            onPress={() => setSelectedChild(null)}
            accessibilityLabel="All"
          >
            <Text variant="caption" style={[styles.chipText, !selectedChild && styles.chipTextActive]}>
              All
            </Text>
          </Pressable>
          {children
            .slice()
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map((c) => {
              const active = selectedChild === c.id;
              return (
                <Pressable
                  key={c.id}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setSelectedChild(c.id)}
                  accessibilityLabel={c.name}
                >
                  <Text variant="caption" style={[styles.chipText, active && styles.chipTextActive]}>
                    {c.name}
                  </Text>
                </Pressable>
              );
            })}
        </ScrollView>
      ) : null}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: contentPadding, maxWidth, alignSelf: maxWidth ? 'center' : 'stretch' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {visible.map((l) => (
            <Pressable
              key={l.id}
              style={styles.card}
              onPress={() => router.push({ pathname: '/resort/[id]', params: { id: l.id } })}
              accessibilityLabel={l.title}
            >
              <View style={styles.imageWrap}>
                <Image source={ResortImage} style={styles.image} resizeMode="cover" />
              </View>
              <Text variant="bodySemibold" numberOfLines={1} style={styles.title}>
                {l.title}
              </Text>
              <View style={styles.metaRow}>
                <Text variant="caption" style={styles.price}>
                  {l.price_start ? `₹${Number(l.price_start).toLocaleString('en-IN')}/night` : '—'}
                </Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star-outline" size={12} color={colors.rating.star} />
                  <Text variant="caption" style={styles.rating}>
                    4.5
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing['3'],
    paddingBottom: spacing['3'],
    minHeight: 56,
  },
  headerTitle: { flex: 1, marginLeft: spacing['1'] },
  bellWrap: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,32,0,0.03)',
  },
  searchWrap: { marginBottom: spacing['3'] },
  chipsRow: { gap: spacing['2'], paddingBottom: spacing['1'] },
  chip: {
    height: 32,
    paddingHorizontal: spacing['3'],
    borderRadius: 10,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(229,77,46,0.06)',
  },
  chipText: { color: colors.text.secondary },
  chipTextActive: { color: colors.text.primary, fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: spacing['2'], paddingBottom: spacing['8'] },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['3'],
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius.xl,
    padding: spacing['3'],
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: spacing['2'],
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1.4,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.gray['2'],
  },
  image: { width: '100%', height: '100%' },
  title: { color: colors.text.primary },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { color: colors.text.secondary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { color: colors.text.secondary },
});

