import {
    Button,
    Input,
    Text
} from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { borderRadius, colors, components, spacing, typography } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ArrowTopRight from '@/assets/images/arrow-top-right.svg';
import BagIll from '@/assets/images/bag ill 1.svg';
import BellIcon from '@/assets/images/bell.svg';
import HeartIcon from '@/assets/images/heart.svg';
import HillIll from '@/assets/images/hill ill 1.svg';
import Logo from '@/assets/images/logogotrip.svg';
import RoomsIll from '@/assets/images/Rooms ill 1.svg';
import TypeIcon from '@/assets/images/type.svg';
import type { Listing, ListingMedia } from '@/src/api/types';
import { useCategoriesByType } from '@/src/hooks/useCategoriesByType';
import { useListings } from '@/src/hooks/useListings';
import { useRootCategories } from '@/src/hooks/useRootCategories';

const ResortImage = require('../../assets/images/resort.jpg');
const WebLogo = require('../../assets/images/logogotrip.png');

const TYPE_ICON_BG = '#FFD49A';
const TYPE_LABEL_COLOR = '#545454';
const TYPE_ICON_SIZE = 56;
// Gradient for types section (Figma 110-792): blend from screen bg, lighter → darker below types
const TYPES_GRADIENT_TOP = '#FFFBF9';
const TYPES_GRADIENT_BOTTOM = '#FFE8E0';
const TYPES_GRADIENT_BLUR_RADIUS = 10; // soft edge at bottom (height of fade strip ≈ 2× radius)
// 3-stop gradient so top blends with screen (no visible start line)
const TYPES_GRADIENT_COLORS = [colors.surface.lightPink, TYPES_GRADIENT_TOP, TYPES_GRADIENT_BOTTOM] as const;
const TYPES_GRADIENT_LOCATIONS = [0, 0.25, 1] as const;

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

// Room type cards (Figma 110-801): icon type.svg + label, same icon for all.
const ROOM_TYPES: Array<{ id: string; label: string }> = [
  { id: 'budget', label: 'Budget' },
  { id: 'private', label: 'Private' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'beach', label: 'Beach' },
  { id: 'hillstation', label: 'Hill station' },
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
  imageUrl,
  onPress,
  cardStyle,
  containerPadding = 0,
}: {
  title: string;
  price: string;
  rating: string;
  imageUrl?: string | null;
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
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.stayImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.stayImagePlaceholder} accessibilityLabel="Listing image placeholder">
            <Ionicons name="image-outline" size={26} color={colors.text.caption} />
          </View>
        )}
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
  const [roomsMode, setRoomsMode] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null); // id of selected type

  const { data: categoriesRes, isLoading: isCategoriesLoading } = useCategoriesByType(
    'hotel',
    roomsMode,
  );

  const { data: rootCategoriesRes } = useRootCategories(!roomsMode);
  const { data: listingsRes } = useListings({ page: 1, limit: 20 }, !roomsMode);
  const { data: nearYouRes } = useListings(
    { location: 'varkala', page: 1, limit: 20 },
    !roomsMode,
  );
  const { data: economicRes } = useListings({ max_price: 2499, page: 1, limit: 20 }, !roomsMode);

  const categoryMetaById = (() => {
    const parents = rootCategoriesRes?.data ?? [];
    const map = new Map<string, { name: string; sortOrder: number; type?: string | null }>();
    parents.forEach((c) => {
      map.set(c.id, { name: c.name, sortOrder: c.sort_order ?? 0, type: c.type ?? null });
    });
    return map;
  })();

  const getPrimaryImage = (media?: ListingMedia[]) => {
    if (!media?.length) return null;
    const isDirectImageUrl = (url: string) => {
      const u = url.toLowerCase();
      if (!u.startsWith('http')) return false;
      // accept common direct image URLs; reject HTML page links like https://ibb.co/<code>
      return (
        u.includes('i.ibb.co/') ||
        u.endsWith('.jpg') ||
        u.endsWith('.jpeg') ||
        u.endsWith('.png') ||
        u.endsWith('.webp') ||
        u.endsWith('.gif') ||
        u.includes('cloudfront') ||
        u.includes('amazonaws.com') ||
        u.includes('cdn')
      );
    };

    const images = media.filter((m) => m.media_type === 'image' && !!m.url && isDirectImageUrl(m.url));
    const first = images.find((m) => m.sort_order === 0) ?? images[0];
    return first?.url ?? null;
  };

  // Desktop web-only home (Figma 158-11304). Must not affect iOS/Android/mobile web.
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  if (isDesktopWeb) {
    const listings = listingsRes?.data ?? [];
    const suggested = listings.slice(0, 6);
    const topRated = listings.slice(0, 5);
    const budget = (economicRes?.data ?? listings).slice(0, 5);
    const luxury = listings.slice(0, 5);

    const cardW = 200;

    const DesktopSection = ({
      title,
      items,
    }: {
      title: string;
      items: Listing[];
    }) => (
      <View style={stylesWeb.section}>
        <View style={stylesWeb.sectionHeader}>
          <Text variant="bodySemibold" style={stylesWeb.sectionTitle}>
            {title}
          </Text>
          <Pressable accessibilityLabel="View all" style={stylesWeb.viewAllBtn}>
            <Text variant="caption" style={stylesWeb.viewAllText}>
              View all
            </Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={stylesWeb.row}>
          {items.map((l) => {
            const img = getPrimaryImage(l.media);
            const price =
              l.price_start != null ? `₹${Number(l.price_start).toLocaleString('en-IN')}/night` : '—';
            return (
              <Pressable
                key={l.id}
                style={[stylesWeb.cardWrap, { width: cardW }]}
                onPress={() => router.push({ pathname: '/resort/[id]', params: { id: l.id } })}
                accessibilityLabel={l.title}
              >
                <View style={stylesWeb.cardImageWrap}>
                  {img ? (
                    <Image source={{ uri: img }} style={stylesWeb.cardImage} resizeMode="cover" />
                  ) : (
                    <View style={stylesWeb.cardImagePlaceholder}>
                      <Ionicons name="image-outline" size={22} color={colors.text.caption} />
                    </View>
                  )}
                  <View style={stylesWeb.heartBadge}>
                    <HeartIcon width={18} height={18} />
                  </View>
                </View>
                <View style={stylesWeb.cardMetaRow}>
                  <Text variant="caption" numberOfLines={2} style={stylesWeb.cardTitle}>
                    {l.title}
                  </Text>
                  <View style={stylesWeb.cardRating}>
                    <Ionicons name="star-outline" size={14} color={colors.rating.star} />
                    <Text variant="caption" style={stylesWeb.cardRatingText}>
                      4.5
                    </Text>
                  </View>
                </View>
                <Text variant="caption" style={stylesWeb.cardPrice}>
                  {price}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );

    return (
      <SafeAreaView style={stylesWeb.page} edges={['top']}>
        <ScrollView
          style={stylesWeb.scroll}
          contentContainerStyle={stylesWeb.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={stylesWeb.container}>
            {/* Header */}
            <View style={stylesWeb.header}>
              {Platform.OS === 'web' ? (
                <Image source={WebLogo} style={stylesWeb.logoImg} resizeMode="contain" />
              ) : (
                <Logo width={90} height={42} />
              )}
              <View style={stylesWeb.searchWrap}>
                <Input
                  placeholder="Search"
                  style={stylesWeb.searchInput}
                  placeholderTextColor="rgba(28,32,36,0.7)"
                />
                <View style={stylesWeb.searchIcon}>
                  <Ionicons name="search" size={16} color={colors.primary} />
                </View>
              </View>
              <View style={stylesWeb.headerActions}>
                <Pressable style={stylesWeb.iconBtn} accessibilityLabel="Notifications">
                  <BellIcon width={18} height={18} />
                </Pressable>
                <Pressable style={[stylesWeb.iconBtn, stylesWeb.avatarBtn]} accessibilityLabel="Profile">
                  <Ionicons name="person-outline" size={18} color={colors.surface.white} />
                </Pressable>
                <Pressable style={stylesWeb.menuBtn} accessibilityLabel="Menu">
                  <Ionicons name="menu" size={22} color={colors.primary} />
                </Pressable>
              </View>
            </View>

            {/* Category tiles */}
            <View style={stylesWeb.tilesRow}>
              {CATEGORIES.map((c) => (
                <View key={c.title} style={stylesWeb.tileOuter}>
                  <CategoryCard
                    title={c.title}
                    subtitle={c.subtitle}
                    bg={c.bg}
                    iconKey={c.iconKey}
                    onPress={() => {}}
                  />
                </View>
              ))}
            </View>

            <DesktopSection title="Suggested for you" items={suggested} />
            <DesktopSection title="Top rated stays" items={topRated} />
            <DesktopSection title="Budget options" items={budget} />
            <DesktopSection title="Luxury resorts" items={luxury} />
          </View>

          {/* Footer */}
          <View style={stylesWeb.footer}>
            <View style={stylesWeb.footerInner}>
              <Text variant="caption" style={stylesWeb.footerLink}>
                More info
              </Text>
              <Text variant="caption" style={stylesWeb.footerLink}>
                Link 1
              </Text>
              <Text variant="caption" style={stylesWeb.footerLink}>
                Link 2
              </Text>
              <View style={{ flex: 1 }} />
              <Text variant="caption" style={stylesWeb.footerBrand}>
                GOTRIP HOLIDAY
              </Text>
              <View style={{ flex: 1 }} />
              <Text variant="caption" style={stylesWeb.footerLink}>
                More info
              </Text>
              <Text variant="caption" style={stylesWeb.footerLink}>
                Link 1
              </Text>
              <Text variant="caption" style={stylesWeb.footerLink}>
                Link 2
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const groupedListings = (() => {
    const list = listingsRes?.data ?? [];
    const byCategory = new Map<
      string,
      { categoryId: string; categoryName: string; sortOrder: number; items: Listing[] }
    >();

    list.forEach((l) => {
      const categoryId = l.category?.id ?? l.category_id;
      const meta = categoryId ? categoryMetaById.get(categoryId) : undefined;
      const categoryName = meta?.name ?? l.category?.name ?? 'Listings';
      const sortOrder = meta?.sortOrder ?? Number.MAX_SAFE_INTEGER;
      const key = categoryId || categoryName;
      const existing = byCategory.get(key);
      if (existing) existing.items.push(l);
      else byCategory.set(key, { categoryId, categoryName, sortOrder, items: [l] });
    });

    return Array.from(byCategory.values())
      .filter((g) => g.items.length)
      .filter((g) => {
        const meta = g.categoryId ? categoryMetaById.get(g.categoryId) : undefined;
        // Don't show Packages section on home; package has its own bento tile
        return (meta?.type ?? null) !== 'package' && g.categoryName.toLowerCase() !== 'packages';
      })
      .sort((a, b) => a.sortOrder - b.sortOrder || a.categoryName.localeCompare(b.categoryName));
  })();

  const economicListings = (() => {
    const list = economicRes?.data ?? [];
    return list.filter((l) => (l.category?.type ?? null) !== 'package');
  })();

  const nearYouListings = (() => {
    const list = nearYouRes?.data ?? [];
    return list.filter((l) => (l.category?.type ?? null) !== 'package');
  })();

  const apiRoomTypes = (() => {
    const parents = categoriesRes?.data ?? [];
    const roomsCategory = parents[0];
    const children = roomsCategory?.children ?? [];
    const active = children.filter((c) => c.is_active !== false);
    const sorted = [...active].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    return sorted.map((c) => ({
      id: c.slug || c.id,
      label: c.name,
    }));
  })();

  const roomTypesToRender = apiRoomTypes.length ? apiRoomTypes : ROOM_TYPES;

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
        {roomsMode ? (
          <View style={styles.typesSectionWrap}>
            <LinearGradient
              colors={TYPES_GRADIENT_COLORS}
              locations={TYPES_GRADIENT_LOCATIONS}
              style={styles.typesSectionGradient}
            >
              <View style={[styles.topFixed, { paddingHorizontal: contentPadding }]}>
                <View style={styles.header}>
                  <View style={styles.headerLeft}>
                    <Pressable
                      style={styles.backButton}
                      onPress={() => { setRoomsMode(false); setSelectedRoomType(null); }}
                      hitSlop={12}
                      accessibilityLabel="Back to categories"
                    >
                      <Ionicons name="chevron-back" size={24} color={colors.primary} />
                    </Pressable>
                    <Text variant="header" style={styles.resortTitle}>Resorts</Text>
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
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.roomTypesScroll}
                contentContainerStyle={[styles.roomTypesContent, { paddingRight: contentPadding, paddingHorizontal: contentPadding }]}
              >
                {(isCategoriesLoading ? ROOM_TYPES : roomTypesToRender).map((type) => {
                  const isSelected = selectedRoomType === type.id;
                  return (
                    <Pressable
                      key={type.id}
                      style={[
                        styles.roomTypeCard,
                        isSelected && styles.roomTypeCardSelected,
                      ]}
                      onPress={() => setSelectedRoomType(isSelected ? null : type.id)}
                    >
                      <View style={styles.roomTypeIconWrap}>
                        <TypeIcon width={TYPE_ICON_SIZE} height={TYPE_ICON_SIZE} />
                      </View>
                      <Text
                        variant="body"
                        style={[
                          styles.roomTypeLabel,
                          isSelected && styles.roomTypeLabelSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {type.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </LinearGradient>
            <LinearGradient
              colors={[TYPES_GRADIENT_BOTTOM, colors.surface.lightPink]}
              style={[styles.typesSectionBlurEdge, { height: TYPES_GRADIENT_BLUR_RADIUS * 2 }]}
              pointerEvents="none"
            />
          </View>
        ) : (
        <View style={[styles.topFixed, { paddingHorizontal: contentPadding }]}>
          <View style={styles.header}>
            <View style={styles.logoWrap}>
            {Platform.OS === 'web' ? (
              <Image source={WebLogo} style={[styles.webLogo, { width: logoWidth, height: logoHeight }]} resizeMode="contain" />
            ) : (
              <Logo width={logoWidth} height={logoHeight} />
            )}
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
        )}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: contentPadding },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {roomsMode ? (
          <View style={styles.roomTypesBottomSpacer} />
          ) : (
          <View style={styles.bentoGrid}>
            <View style={styles.bentoRow}>
              <View style={styles.bentoCell2}>
                <CategoryCard
                  title={CATEGORIES[0].title}
                  subtitle={CATEGORIES[0].subtitle}
                  bg={CATEGORIES[0].bg}
                  iconKey={CATEGORIES[0].iconKey}
                  onPress={() => setRoomsMode(true)}
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
          )}

          {!roomsMode ? (
            <>
              {economicListings.length ? (
                <View key="economic">
                  <SectionRow title="Economic" onViewAll={() => {}} />
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.horizontalList, { paddingHorizontal: 0 }]}
                  >
                    {economicListings.map((listing) => (
                      <StayCard
                        key={listing.id}
                        title={listing.title}
                        price={`₹${Number(listing.price_start ?? 0).toLocaleString('en-IN')}/night`}
                        rating={'4.5'}
                        imageUrl={getPrimaryImage(listing.media)}
                        onPress={() =>
                          router.push({
                            pathname: '/resort/[id]',
                            params: {
                              id: listing.id,
                              title: listing.title,
                              price: `₹${Number(listing.price_start ?? 0).toLocaleString('en-IN')}`,
                              rating: '4.5',
                            },
                          })
                        }
                        containerPadding={contentPadding}
                      />
                    ))}
                  </ScrollView>
                </View>
              ) : null}

              {nearYouListings.length ? (
                <View key="near-you">
                  <SectionRow title="Near you" onViewAll={() => {}} />
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.horizontalList, { paddingHorizontal: 0 }]}
                  >
                    {nearYouListings.map((listing) => (
                      <StayCard
                        key={listing.id}
                        title={listing.title}
                        price={`₹${Number(listing.price_start ?? 0).toLocaleString('en-IN')}/night`}
                        rating={'4.5'}
                        imageUrl={getPrimaryImage(listing.media)}
                        onPress={() =>
                          router.push({
                            pathname: '/resort/[id]',
                            params: {
                              id: listing.id,
                              title: listing.title,
                              price: `₹${Number(listing.price_start ?? 0).toLocaleString('en-IN')}`,
                              rating: '4.5',
                            },
                          })
                        }
                        containerPadding={contentPadding}
                      />
                    ))}
                  </ScrollView>
                </View>
              ) : null}

              {groupedListings.map((group) => (
                <View key={group.categoryId || group.categoryName}>
                  <SectionRow title={group.categoryName} onViewAll={() => {}} />
                  {isMobile ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={[styles.horizontalList, { paddingHorizontal: 0 }]}
                    >
                      {group.items.map((listing) => (
                        <StayCard
                          key={listing.id}
                          title={listing.title}
                          price={`₹${Number(listing.price_start ?? 0).toLocaleString('en-IN')}/night`}
                          rating={'4.5'}
                          imageUrl={getPrimaryImage(listing.media)}
                          onPress={() =>
                            router.push({
                              pathname: '/resort/[id]',
                              params: {
                                id: listing.id,
                                title: listing.title,
                                price: `₹${Number(listing.price_start ?? 0).toLocaleString('en-IN')}`,
                                rating: '4.5',
                              },
                            })
                          }
                          cardStyle={{}}
                          containerPadding={contentPadding}
                        />
                      ))}
                    </ScrollView>
                  ) : (
                    <View style={styles.staysGrid}>
                      {group.items.map((listing) => (
                        <StayCard
                          key={listing.id}
                          title={listing.title}
                          price={`₹${Number(listing.price_start ?? 0).toLocaleString('en-IN')}/night`}
                          rating={'4.5'}
                          imageUrl={getPrimaryImage(listing.media)}
                          onPress={() =>
                            router.push({
                              pathname: '/resort/[id]',
                              params: {
                                id: listing.id,
                                title: listing.title,
                                price: `₹${Number(listing.price_start ?? 0).toLocaleString('en-IN')}`,
                                rating: '4.5',
                              },
                            })
                          }
                          cardStyle={styles.stayCardGrid}
                          containerPadding={contentPadding}
                        />
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </>
          ) : null}

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
  typesSectionWrap: {
    width: '100%',
    position: 'relative',
  },
  typesSectionGradient: {
    width: '100%',
  },
  typesSectionBlurEdge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
  },
  resortTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    fontSize: 16,
    lineHeight: 24,
    color: '#FF383C',
  },
  backButton: {
    padding: spacing['2'],
    marginLeft: -spacing['2'],
  },
  logoWrap: {
    flexDirection: 'column',
  },
  webLogo: {
    alignSelf: 'flex-start',
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
  roomTypesScroll: {
    marginBottom: spacing['4'],
  },
  roomTypesContent: {
    flexDirection: 'row',
    gap: spacing['3'],
    paddingRight: spacing['4'],
  },
  roomTypeCard: {
    width: 88,
    alignItems: 'center',
    borderRadius: borderRadius.xl,
  },
  roomTypeCardSelected: {
    opacity: 1,
  },
  roomTypeIconWrap: {
    width: TYPE_ICON_SIZE + 16,
    height: TYPE_ICON_SIZE + 16,
    borderRadius: borderRadius.xl,
    backgroundColor: TYPE_ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2'],
  },
  roomTypeLabel: {
    color: TYPE_LABEL_COLOR,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  roomTypeLabelSelected: {
    color: TYPE_LABEL_COLOR,
  },
  roomTypesBottomSpacer: {
    height: spacing['2'],
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
  stayImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray['2'],
    alignItems: 'center',
    justifyContent: 'center',
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

// Desktop web-only styles (do not affect native/mobile web).
const stylesWeb = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['7'],
  },
  container: {
    width: '100%',
    maxWidth: 1280,
    alignSelf: 'center',
    paddingHorizontal: 40,
  },
  header: {
    marginTop: spacing['4'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing['4'],
  },
  searchWrap: {
    flex: 1,
    maxWidth: 520,
    position: 'relative',
  },
  searchInput: {
    height: 40,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(229,77,46,0.10)',
    borderWidth: 0,
    paddingLeft: spacing['4'],
    paddingRight: 44,
  },
  searchIcon: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'rgba(229,77,46,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBtn: {
    backgroundColor: colors.primary,
  },
  menuBtn: {
    width: 22,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tilesRow: {
    marginTop: spacing['5'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing['4'],
  },
  tileOuter: {
    flex: 1,
  },
  section: {
    marginTop: spacing['6'],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['3'],
  },
  sectionTitle: {
    color: colors.text.primary,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    color: colors.primary,
  },
  row: {
    gap: spacing['3'],
    paddingBottom: spacing['1'],
  },
  cardWrap: {
    gap: spacing['2'],
  },
  cardImageWrap: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.gray['2'],
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray['2'],
  },
  heartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing['2'],
  },
  cardTitle: {
    flex: 1,
    color: colors.text.primary,
  },
  cardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardRatingText: {
    color: colors.text.secondary,
  },
  cardPrice: {
    color: colors.text.secondary,
  },
  footer: {
    marginTop: spacing['7'],
    backgroundColor: colors.primary,
    paddingVertical: spacing['5'],
  },
  footerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['4'],
    maxWidth: 1280,
    alignSelf: 'center',
    paddingHorizontal: 40,
  },
  footerLink: {
    color: colors.surface.white,
  },
  footerBrand: {
    color: colors.surface.white,
    letterSpacing: 4,
  },
  logoImg: {
    width: 90,
    height: 42,
  },
});
