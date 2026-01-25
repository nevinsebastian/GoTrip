import { useEffect } from 'react';
import { router } from 'expo-router';

/**
 * Root index route - redirects to login screen
 */
export default function Index() {
  useEffect(() => {
    // Redirect to login immediately
    router.replace('/login');
  }, []);

  // Return null while redirecting
  return null;
}
