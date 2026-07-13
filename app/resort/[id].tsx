import { Redirect, useLocalSearchParams } from 'expo-router';

/** Backward-compatible alias — hotel detail lives at /hotels/[id]. */
export default function ResortDetailsRedirect() {
  const { id, ...rest } = useLocalSearchParams<{ id?: string }>();
  if (!id) {
    return <Redirect href="/resorts" />;
  }
  return (
    <Redirect
      href={{
        pathname: '/hotels/[id]',
        params: { id, ...rest },
      }}
    />
  );
}
