import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

/**
 * Bottom inset to lift content above the soft keyboard.
 * Works on iOS/Android Keyboard events and mobile web visualViewport.
 */
export function useKeyboardBottomInset(): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined' || !window.visualViewport) return;

      const vv = window.visualViewport;
      const update = () => {
        const covered = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
        setInset(covered);
      };
      update();
      vv.addEventListener('resize', update);
      vv.addEventListener('scroll', update);
      return () => {
        vv.removeEventListener('resize', update);
        vv.removeEventListener('scroll', update);
      };
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (e) => {
      setInset(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => setInset(0));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return inset;
}
