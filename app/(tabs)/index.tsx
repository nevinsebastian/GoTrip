import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  Text,
  Input,
  Card,
  Button,
  Image,
} from '@/components/ui';
import { colors, spacing, borderRadius, components } from '@/constants/DesignTokens';
import { useResponsive } from '@/components/ui/useResponsive';

import Logo from '@/assets/images/logogotrip.svg';
import BellIcon from '@/assets/images/bell.svg';
import HeartIcon from '@/assets/images/heart.svg';

const { width: screenWidth } = Dimensions.get('window');

const CATEGORIES = [
  {
    title: 'Packages',
    subtitle: 'Travel with Gotrip',
    bg: colors.surface.lightPink,
  },
  {
    title: 'Glamping',
    subtitle: 'Glamorous camping',
    bg: '#E8F5E9',
  },
  {
    title: 'Rooms/hotels',
    subtitle: 'Book Resorts & Stays',
    bg: '#F3E5F5',
  },
  {
    title: 'Activities',
    subtitle: 'Other experiences',
    bg: '#FFE0B2',
  },
];

const STAYS = [
  { title: 'Luxury stay in Wayanad', price: '₹1199/night', rating: '4.5' },
  { title: 'Luxury stay in Wayanad', price: '₹1199/night', rating: '4.5' },
  { title: 'Luxury stay in Wayanad', price: '₹1199/night', rating: '4.5' },
];

function CategoryCard({
  title,
  subtitle,
  bg,
  onPress,
}: {
  title: string;
  subtitle: string;
  bg: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryCard,
        { backgroundColor: bg },
        pressed && styles.categoryPressed,
      ]}
    >
      <Text variant="bodySemibold" style={styles.categoryTitle}>
        {title}
      </Text>
      <Text variant="caption" style={styles.categorySubtitle}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

function StayCard({
  title,
  price,
  rating,
  onPress,
}: {
  title: string;
  price: string;
  rating: string;
  onPress: () => void;
}) {
  const cardWidth = Math.min(
    components.resortCard.maxWidth,
    screenWidth * 0.45
  );
  return (
    <Pressable onPress={onPress} style={[styles.stayCardWrap, { width: cardWidth }]}>
      <Card variant="listing" padding="none" style={styles.stayCard}>
        <View style={styles.stayImageWrap}>
          <View style={styles.stayImagePlaceholder} />
          <View style={styles.favoriteBadge}>
            <HeartIcon width={20} height={20} />
          </View>
        </View>
        <View style={styles.stayContent}>
          <Text variant="bodySemibold" numberOfLines={2} style={styles.stayTitle}>
            {title}
          </Text>
          <View style={styles.stayMeta}>
            <Text variant="price" style={styles.stayPrice}>
              {price}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star-outline" size={14} color={colors.rating.star} />
              <Text variant="ratingValue" style={styles.stayRating}>
                {rating}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

function SectionRow({
  title,
  onViewAll,
}: {
  title: string;
  onViewAll: () => void;
}) {
  return (
    <View style={styles.sectionRow}>
      <Text variant="sectionTitle" style={styles.sectionTitle}>
        {title}
      </Text>
      <Button variant="link" icon="chevron-forward" iconPosition="right" onPress={onViewAll}>
        View all
      </Button>
    </View>
  );
}

export default function HomeScreen() {
  const { isMobile } = useResponsive();
  const contentPadding = isMobile ? spacing['4'] : spacing['6'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: contentPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Logo width={100} height={36} />
            <Text variant="caption" style={styles.logoSub}>
              holiday
            </Text>
          </View>
          <Pressable onPress={() => {}} style={styles.bellWrap}>
            <BellIcon width={24} height={24} />
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <Input
            variant="search"
            showSearchIcon
            placeholder="Search"
            placeholderTextColor={colors.text.placeholder}
          />
        </View>

        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat, i) => (
            <View key={cat.title} style={styles.categoryCell}>
              <CategoryCard
                title={cat.title}
                subtitle={cat.subtitle}
                bg={cat.bg}
                onPress={() => {}}
              />
            </View>
          ))}
        </View>

        <SectionRow title="Suggested for you" onViewAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.horizontalList, { paddingHorizontal: 0 }]}
        >
          {STAYS.map((stay, i) => (
            <StayCard
              key={i}
              title={stay.title}
              price={stay.price}
              rating={stay.rating}
              onPress={() => {}}
            />
          ))}
        </ScrollView>

        <SectionRow title="Top rated stays" onViewAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.horizontalList, { paddingHorizontal: 0 }]}
        >
          {STAYS.map((stay, i) => (
            <StayCard
              key={`top-${i}`}
              title={stay.title}
              price={stay.price}
              rating={stay.rating}
              onPress={() => {}}
            />
          ))}
        </ScrollView>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray['2'],
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing['4'],
    paddingBottom: spacing['8'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['4'],
  },
  logoWrap: {
    flexDirection: 'column',
  },
  logoSub: {
    color: colors.text.primary,
    marginTop: 2,
  },
  bellWrap: {
    padding: spacing['2'],
  },
  searchWrap: {
    width: '100%',
    marginBottom: spacing['5'],
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing['1'],
    marginBottom: spacing['6'],
  },
  categoryCell: {
    width: '50%',
    padding: spacing['1'],
    aspectRatio: 1.2,
  },
  categoryCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    padding: spacing['4'],
    justifyContent: 'flex-end',
  },
  categoryPressed: {
    opacity: 0.9,
  },
  categoryTitle: {
    color: colors.text.primary,
  },
  categorySubtitle: {
    color: colors.text.secondary,
    marginTop: 2,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['3'],
  },
  sectionTitle: {
    color: colors.text.primary,
  },
  horizontalList: {
    paddingBottom: spacing['4'],
    gap: spacing['4'],
    paddingRight: spacing['4'],
  },
  stayCardWrap: {
    marginRight: spacing['4'],
  },
  stayCard: {
    width: '100%',
    overflow: 'hidden',
  },
  stayImageWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: components.resortCard.imageAspectRatio,
  },
  stayImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.neutral.alpha['4'],
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  favoriteBadge: {
    position: 'absolute',
    top: components.resortCard.favoriteIconOffset,
    right: components.resortCard.favoriteIconOffset,
    width: 32,
    height: 32,
    borderRadius: borderRadius['3'],
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stayContent: {
    padding: components.resortCard.contentPadding,
  },
  stayTitle: {
    color: colors.text.primary,
  },
  stayMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing['2'],
  },
  stayPrice: {
    color: colors.text.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stayRating: {
    color: colors.text.primary,
  },
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 100 : 80,
  },
});
