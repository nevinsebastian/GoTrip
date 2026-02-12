import {
  Button,
  Input,
  Text
} from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { borderRadius, colors, components, spacing } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BellIcon from '@/assets/images/bell.svg';
import HeartIcon from '@/assets/images/heart.svg';
import Logo from '@/assets/images/logogotrip.svg';
import BagIll from '@/assets/images/bag ill 1.svg';
import HillIll from '@/assets/images/hill ill 1.svg';
import RoomsIll from '@/assets/images/Rooms ill 1.svg';
import ArrowTopRight from '@/assets/images/arrow-top-right.svg';

const ResortImage = require('../../assets/images/resort.png');

type CategoryIconKey = 'rooms' | 'packages' | 'glamping' | 'activities';

function CategoryIcon({ iconKey, size }: { iconKey: CategoryIconKey; size: number }) {
  switch (iconKey) {
    case 'rooms':
      return <RoomsIll width={size} height={size} />;
    case 'packages':
      return <BagIll width={size} height={size} />;
    case 'glamping':
      return <HillIll width={size} height={size} />;
    case 'activities':
      return <ArrowTopRight width={size} height={size} />;
    default:
      return null;
  }
}

const CATEGORIES: Array<{ title: string; subtitle: string; bg: string; iconKey: CategoryIconKey }> = [
  { title: 'Rooms/hotels', subtitle: 'Book Resorts & Stays', bg: '#F3E5F5', iconKey: 'rooms' },
  { title: 'Packages', subtitle: 'Travel with Gotrip', bg: colors.surface.lightPink, iconKey: 'packages' },
  { title: 'Glamping', subtitle: 'Glamorous camping', bg: '#E8F5E9', iconKey: 'glamping' },
  { title: 'Activities', subtitle: 'Other experiences', bg: '#FFE0B2', iconKey: 'activities' },
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
  iconKey,
}: {
  title: string;
  subtitle: string;
  bg: string;
  onPress: () => void;
  iconKey: CategoryIconKey;
}) {
  const { width, isMobile, isTablet } = useResponsive();
  
  const illustrationSize = isMobile 
    ? Math.min(72, width * 0.18) 
    : isTablet 
    ? Math.min(80, width * 0.12)
    : Math.min(96, width * 0.1);
  
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryCard,
        { backgroundColor: bg },
        pressed && styles.categoryPressed,
      ]}
    >
      <View style={[styles.categoryIllustrationWrap, { width: illustrationSize, height: illustrationSize }]} pointerEvents="none">
        <CategoryIcon iconKey={iconKey} size={illustrationSize} />
      </View>
      <View style={styles.categoryTextWrap}>
        <Text variant="bodySemibold" style={styles.categoryTitle}>
          {title}
        </Text>
        <Text variant="caption" style={styles.categorySubtitle}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

function StayCard({
  title,
  price,
  rating,
  onPress,
  cardStyle,
  containerPadding = 0,
}: {
  title: string;
  price: string;
  rating: string;
  onPress: () => void;
  cardStyle?: any;
  containerPadding?: number;
}) {
  const { width, isMobile, isTablet } = useResponsive();
  
  // Calculate card width to show 2 cards at once
  // Account for container padding and gap between cards
  const gap = spacing['3']; // 12px gap between cards
  const availableWidth = width - (containerPadding * 2);
  
  // For mobile: ensure 2 cards fit with spacing
  // Each card = (available width - gap) / 2, capped at maxWidth
  const calculatedWidth = isMobile
    ? Math.floor((availableWidth - gap) / 2)
    : isTablet
    ? Math.floor((availableWidth - gap * 2) / 3) // 3 cards on tablet
    : Math.floor((availableWidth - gap * 3) / 4); // 4 cards on desktop
  
  const cardWidth = Math.min(components.resortCard.maxWidth, calculatedWidth);
  
  // Responsive icon sizes
  const heartIconSize = isMobile ? 20 : 24;
  const starIconSize = isMobile ? 14 : 16;
  
  return (
    <Pressable onPress={onPress} style={[styles.stayCardWrap, { width: cardWidth }, cardStyle]}>
      {/* Image: rectangle with all sides rounded (separate from text) */}
      <View style={styles.stayImageWrap}>
        <Image
          source={ResortImage}
          style={styles.stayImage}
          resizeMode="cover"
        />
        <View style={styles.favoriteBadge}>
          <HeartIcon width={heartIconSize} height={heartIconSize} />
        </View>
      </View>
      {/* Text below the image - not in the same card */}
      <View style={styles.stayContent}>
        <Text variant="bodySemibold" numberOfLines={2} style={styles.stayTitle}>
          {title}
        </Text>
        <View style={styles.stayMeta}>
          <Text variant="price" style={styles.stayPrice}>
            {price}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star-outline" size={starIconSize} color={colors.rating.star} />
            <Text variant="ratingValue" style={styles.stayRating}>
              {rating}
            </Text>
          </View>
        </View>
      </View>
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
  const { isMobile, isTablet, isDesktop, width } = useResponsive();
  
  // Responsive padding based on screen size
  const contentPadding = isMobile 
    ? spacing['4'] 
    : isTablet 
    ? spacing['5'] 
    : spacing['6'];
  
  // Responsive logo size
  const logoWidth = isMobile ? Math.min(100, width * 0.25) : isTablet ? 120 : 140;
  const logoHeight = logoWidth * 0.36; // Maintain aspect ratio
  
  // Responsive icon sizes
  const bellIconSize = isMobile ? 24 : isTablet ? 26 : 28;
  
  // Responsive category card min height
  const categoryMinHeight = isMobile ? 100 : isTablet ? 120 : 140;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[colors.surface.lightPink, colors.surface.background]}
        style={styles.gradient}
      >
        <View style={[styles.topFixed, { paddingHorizontal: contentPadding }]}>
          <View style={styles.header}>
            <View style={styles.logoWrap}>
              <Logo width={logoWidth} height={logoHeight} />
            </View>
            <Pressable onPress={() => {}} style={styles.bellWrap}>
              <BellIcon width={bellIconSize} height={bellIconSize} />
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
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: contentPadding },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bentoGrid}>
            <View style={styles.bentoRow}>
              <View style={styles.bentoCell2}>
                <CategoryCard
                  title={CATEGORIES[0].title}
                  subtitle={CATEGORIES[0].subtitle}
                  bg={CATEGORIES[0].bg}
                  iconKey={CATEGORIES[0].iconKey}
                  onPress={() => {}}
                />
              </View>
              <View style={styles.bentoCell1}>
                <CategoryCard
                  title={CATEGORIES[1].title}
                  subtitle={CATEGORIES[1].subtitle}
                  bg={CATEGORIES[1].bg}
                  iconKey={CATEGORIES[1].iconKey}
                  onPress={() => {}}
                />
              </View>
            </View>
            <View style={styles.bentoRow}>
              <View style={styles.bentoCell1}>
                <CategoryCard
                  title={CATEGORIES[2].title}
                  subtitle={CATEGORIES[2].subtitle}
                  bg={CATEGORIES[2].bg}
                  iconKey={CATEGORIES[2].iconKey}
                  onPress={() => {}}
                />
              </View>
              <View style={styles.bentoCell2}>
                <CategoryCard
                  title={CATEGORIES[3].title}
                  subtitle={CATEGORIES[3].subtitle}
                  bg={CATEGORIES[3].bg}
                  iconKey={CATEGORIES[3].iconKey}
                  onPress={() => {}}
                />
              </View>
            </View>
          </View>

          <SectionRow title="Suggested for you" onViewAll={() => {}} />
          {isMobile ? (
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
                  containerPadding={contentPadding}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.staysGrid}>
              {STAYS.map((stay, i) => (
                <StayCard
                  key={i}
                  title={stay.title}
                  price={stay.price}
                  rating={stay.rating}
                  onPress={() => {}}
                  cardStyle={styles.stayCardGrid}
                  containerPadding={contentPadding}
                />
              ))}
            </View>
          )}

          <SectionRow title="Top rated stays" onViewAll={() => {}} />
          {isMobile ? (
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
                  containerPadding={contentPadding}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.staysGrid}>
              {STAYS.map((stay, i) => (
                <StayCard
                  key={`top-${i}`}
                  title={stay.title}
                  price={stay.price}
                  rating={stay.rating}
                  onPress={() => {}}
                  cardStyle={styles.stayCardGrid}
                  containerPadding={contentPadding}
                />
              ))}
            </View>
          )}

          <SectionRow title="Budget options" onViewAll={() => {}} />
          {isMobile ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.horizontalList, { paddingHorizontal: 0 }]}
            >
              {STAYS.map((stay, i) => (
                <StayCard
                  key={`budget-${i}`}
                  title={stay.title}
                  price={stay.price}
                  rating={stay.rating}
                  onPress={() => {}}
                  containerPadding={contentPadding}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.staysGrid}>
              {STAYS.map((stay, i) => (
                <StayCard
                  key={`budget-${i}`}
                  title={stay.title}
                  price={stay.price}
                  rating={stay.rating}
                  onPress={() => {}}
                  cardStyle={styles.stayCardGrid}
                  containerPadding={contentPadding}
                />
              ))}
            </View>
          )}

          <SectionRow title="Luxury resorts" onViewAll={() => {}} />
          {isMobile ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.horizontalList, { paddingHorizontal: 0 }]}
            >
              {STAYS.map((stay, i) => (
                <StayCard
                  key={`luxury-${i}`}
                  title={stay.title}
                  price={stay.price}
                  rating={stay.rating}
                  onPress={() => {}}
                  containerPadding={contentPadding}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.staysGrid}>
              {STAYS.map((stay, i) => (
                <StayCard
                  key={`luxury-${i}`}
                  title={stay.title}
                  price={stay.price}
                  rating={stay.rating}
                  onPress={() => {}}
                  cardStyle={styles.stayCardGrid}
                  containerPadding={contentPadding}
                />
              ))}
            </View>
          )}

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.lightPink,
  },
  gradient: {
    flex: 1,
  },
  topFixed: {
    paddingTop: spacing['6'],
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing['4'],
    paddingBottom: spacing['4'], // Minimal padding so content ends at Luxury resorts, no gap before navbar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['3'],
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
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  searchWrap: {
    width: '100%',
    marginBottom: spacing['5'],
  },
  bentoGrid: {
    flexDirection: 'column',
    gap: spacing['3'],
    marginBottom: spacing['6'],
  },
  bentoRow: {
    flexDirection: 'row',
    gap: spacing['3'],
  },
  bentoCell1: {
    flex: 1,
    minWidth: 0,
  },
  bentoCell2: {
    flex: 2,
    minWidth: 0,
  },
  categoryCard: {
    flex: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing['4'],
    justifyContent: 'flex-end',
    overflow: 'hidden',
    position: 'relative',
    minHeight: 100, // Base min height, will be overridden responsively
    borderWidth: 1,
    borderColor: colors.border.gray6,
  },
  categoryIllustrationWrap: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    opacity: 0.9,
  },
  categoryTextWrap: {
    position: 'relative',
    zIndex: 1,
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
    gap: spacing['3'],
    paddingRight: spacing['4'], // Right padding to match container padding
  },
  stayCardWrap: {
    marginRight: spacing['3'],
  },
  staysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['4'],
    marginBottom: spacing['4'],
  },
  stayCardGrid: {
    marginRight: 0,
    flex: 1,
    minWidth: 200,
    maxWidth: '100%',
  },
  stayImageWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: components.resortCard.imageAspectRatio,
    overflow: 'hidden',
    borderRadius: borderRadius.xl, // All sides rounded
  },
  stayImage: {
    width: '100%',
    height: '100%',
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
    paddingTop: spacing['2'],
    paddingHorizontal: 0,
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
});
