# Room type images (Figma node 110-801)

Add images here for the horizontally scrollable room types on the home screen:

- **budget.png** (or .jpg) – Budget
- **private.png** (or .jpg) – Private  
- **luxury.png** (or .jpg) – Luxury

Then in `app/(tabs)/index.tsx`, update `ROOM_TYPES` to use:

```ts
image: require('@/assets/images/types/budget.png'),
image: require('@/assets/images/types/private.png'),
image: require('@/assets/images/types/luxury.png'),
```
