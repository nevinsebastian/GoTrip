import { useWindowDimensions } from 'react-native';

export const HOME_DESIGN_WIDTH = 402;

export function useHomeScale() {
  const { width } = useWindowDimensions();
  const scale = width / HOME_DESIGN_WIDTH;
  const s = (n: number) => Math.round(n * scale);
  return { width, scale, s };
}
