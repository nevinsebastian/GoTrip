import React, { useEffect, useMemo } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Text } from '@/components/ui';
import { colors, spacing, borderRadius } from '@/constants/DesignTokens';

type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  prefill?: {
    email?: string;
    contact?: string;
    name?: string;
  };
  onSuccess: (payload: RazorpaySuccess) => void;
  onError?: (message: string) => void;
};

export function RazorpayCheckoutModal({
  visible,
  onClose,
  keyId,
  orderId,
  amount,
  currency,
  name,
  description,
  prefill,
  onSuccess,
  onError,
}: Props) {
  const html = useMemo(() => {
    // NOTE: Do NOT JSON.stringify functions (Razorpay needs `handler` callback).
    // We stringify only plain data and attach callbacks inside the HTML string.
    const baseOptions = {
      key: keyId,
      amount,
      currency,
      name,
      description: description ?? '',
      order_id: orderId,
      // Ensure Razorpay calls `handler` instead of redirecting the webview.
      redirect: false,
      prefill: prefill ?? {},
    };

    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Checkout</title>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  </head>
  <body style="margin:0;padding:0;background:#fff;">
    <script>
      (function(){
        try {
          var options = ${JSON.stringify(baseOptions)};
          options.handler = function(response) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'success', payload: response }));
          };
          options.modal = {
            ondismiss: function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'dismiss' }));
            }
          };
          var rzp = new Razorpay(options);
          rzp.on('payment.failed', function(resp){
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              message: (resp && resp.error && resp.error.description) ? resp.error.description : 'Payment failed'
            }));
          });
          rzp.open();
        } catch (e) {
          window.ReactNativeWebView.postMessage(JSON.stringify({type:'error', message: String(e)}));
        }
      })();
    </script>
  </body>
</html>`;
  }, [amount, currency, description, keyId, name, orderId, prefill]);

  if (Platform.OS === 'web') {
    // Web: use Razorpay Checkout directly (no WebView).
    useEffect(() => {
      if (!visible) return;
      if (!keyId || !orderId || !amount) {
        onError?.('Missing payment order details.');
        onClose();
        return;
      }

      const w = window as any;

      const openCheckout = () => {
        try {
          const options = {
            key: keyId,
            amount,
            currency,
            name,
            description: description ?? '',
            order_id: orderId,
            redirect: false,
            prefill: prefill ?? {},
            handler: (response: RazorpaySuccess) => {
              onSuccess(response);
            },
            modal: {
              ondismiss: () => onClose(),
            },
          };

          const rzp = new w.Razorpay(options);
          rzp.on('payment.failed', (resp: any) => {
            onError?.(resp?.error?.description ?? 'Payment failed');
            onClose();
          });
          rzp.open();
        } catch (e) {
          onError?.(String(e));
          onClose();
        }
      };

      if (w.Razorpay) {
        openCheckout();
        return;
      }

      const existing = document.querySelector('script[data-razorpay-checkout="1"]') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', openCheckout, { once: true });
        existing.addEventListener(
          'error',
          () => {
            onError?.('Failed to load Razorpay Checkout.');
            onClose();
          },
          { once: true },
        );
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.setAttribute('data-razorpay-checkout', '1');
      script.onload = openCheckout;
      script.onerror = () => {
        onError?.('Failed to load Razorpay Checkout.');
        onClose();
      };
      document.body.appendChild(script);
    }, [amount, currency, description, keyId, name, onClose, onError, onSuccess, orderId, prefill, visible]);

    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text variant="bodySemibold" style={styles.title}>
              Opening payment…
            </Text>
            <Text variant="caption" style={styles.subtitle}>
              If nothing happens, please allow popups for this site.
            </Text>
            <Pressable style={styles.closeBtn} onPress={onClose} accessibilityLabel="Close payment">
              <Text variant="bodySemibold" style={styles.closeBtnText}>
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.fullscreen}>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          javaScriptEnabled
          domStorageEnabled
          mixedContentMode="always"
          setSupportMultipleWindows={false}
          thirdPartyCookiesEnabled
          sharedCookiesEnabled
          onError={(e) => {
            onError?.(e.nativeEvent?.description ?? 'Payment failed to load.');
            onClose();
          }}
          onHttpError={(e) => {
            onError?.(`Payment failed to load (HTTP ${e.nativeEvent?.statusCode}).`);
            onClose();
          }}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data?.type === 'success' && data?.payload) {
                onSuccess(data.payload);
                return;
              }
              if (data?.type === 'dismiss') {
                onClose();
                return;
              }
              if (data?.type === 'error') {
                onError?.(data?.message ?? 'Payment failed');
                onClose();
              }
            } catch {
              onError?.('Payment failed');
              onClose();
            }
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullscreen: { flex: 1, backgroundColor: colors.surface.white },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 8, 48, 0.27)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['4'],
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius['2xl'],
    padding: spacing['5'],
    gap: spacing['3'],
  },
  title: { color: colors.text.primary },
  subtitle: { color: colors.text.secondary },
  closeBtn: {
    marginTop: spacing['2'],
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { color: colors.surface.white },
});

