import BellIcon from '@/assets/images/bell.svg';
import { IconButton, Input, Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { borderRadius, colors, spacing } from '@/constants/DesignTokens';
import { useCategoriesByType } from '@/src/hooks/useCategoriesByType';
import { useListings } from '@/src/hooks/useListings';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BG_TOP = '#FCFCFC';
const BG_BOTTOM = '#FFDCD3';
const ResortImage = require('../assets/images/resort.jpg');

export default function PackagesScreen() {
  const { isMobile, isTablet, width } = useResponsive();
  const contentPadding = isMobile ? spacing['4'] : isTablet ? spacing['5'] : spacing['6'];
  const bellIconSize = isMobile ? 24 : isTablet ? 26 : 28;

  const [query, setQuery] = useState('');

  const { data: categoriesRes } = useCategoriesByType('package', true);
  const packageCategory = categoriesRes?.data?.[0];
  const categoryId = packageCategory?.id;

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

  const maxWidth = width >= 1024 ? 600 : undefined;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.bg} pointerEvents="none" />

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
          Packages
        </Text>
        <Pressable style={styles.bellWrap} accessibilityLabel="Notifications">
          <BellIcon width={bellIconSize} height={bellIconSize} />
        </Pressable>
      </View>

      <View style={[styles.searchWrap, { paddingHorizontal: contentPadding, maxWidth, alignSelf: maxWidth ? 'center' : 'stretch' }]}>
        <Input
          variant="search"
          showSearchIcon
          placeholder="Find travel packages"
          placeholderTextColor={colors.text.placeholder}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: contentPadding, maxWidth, alignSelf: maxWidth ? 'center' : 'stretch' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="bodySemibold" style={styles.sectionTitle}>
          Suggested for you
        </Text>

        <View style={styles.list}>
          {visible.map((l) => (
            <View key={l.id} style={styles.card}>
              <View style={styles.imageWrap}>
                <Image source={ResortImage} style={styles.image} resizeMode="cover" />
              </View>
              <View style={styles.cardBody}>
                <Text variant="bodySemibold" numberOfLines={1} style={styles.cardTitle}>
                  {l.title}
                </Text>
                <View style={styles.cardMetaRow}>
                  <Text variant="caption" style={styles.cardPrice}>
                    {l.price_start ? `₹${Number(l.price_start).toLocaleString('en-IN')}/person` : '—'}
                  </Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star-outline" size={12} color={colors.rating.star} />
                    <Text variant="caption" style={styles.ratingText}>
                      4.5
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <Pressable style={styles.wishlistBtn} accessibilityLabel="Wishlist">
                  <Ionicons name="flame-outline" size={16} color={colors.primary} />
                  <Text variant="bodySemibold" style={styles.wishlistText}>
                    Wishlist
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.reserveBtn}
                  onPress={() => router.push({ pathname: '/resort/[id]', params: { id: l.id } })}
                  accessibilityLabel="Reserve"
                >
                  <Text variant="bodySemibold" style={styles.reserveText}>
                    Reserve
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BG_TOP,
    // simple gradient-ish fallback using overlay (keeps native simple)
    opacity: 1,
  },
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
  searchWrap: { marginBottom: spacing['4'] },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing['8'] },
  sectionTitle: { color: colors.text.primary, marginBottom: spacing['3'] },
  list: { gap: spacing['4'] },
  card: {
    backgroundColor: 'rgba(229,77,46,0.10)',
    borderRadius: 12,
    padding: 8,
    gap: 8,
  },
  imageWrap: {
    height: 170,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.gray['2'],
  },
  image: { width: '100%', height: '100%' },
  cardBody: { gap: 6, paddingHorizontal: 4 },
  cardTitle: { color: colors.text.primary },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardPrice: { color: colors.text.secondary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: colors.text.secondary },
  actionsRow: { flexDirection: 'row', gap: spacing['3'], paddingHorizontal: 4, paddingBottom: 4 },
  wishlistBtn: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(219,37,0,0.52)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'transparent',
  },
  wishlistText: { color: colors.primary },
  reserveBtn: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reserveText: { color: colors.surface.white },
});

