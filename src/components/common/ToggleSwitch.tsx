import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Animated,
  StyleSheet,
} from 'react-native';
import { COLORS } from '@/constants/colors';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onValueChange,
  label,
  disabled = false,
}) => {
  const translateX = React.useRef(new Animated.Value(value ? 18 : 0)).current;

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 18 : 0,
      useNativeDriver: true,
      bounciness: 15,
    }).start();
  }, [value]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={styles.content}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View
          style={[
            styles.track,
            value ? styles.trackActive : styles.trackInactive,
            disabled && styles.trackDisabled,
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              value ? styles.thumbActive : styles.thumbInactive,
              { transform: [{ translateX }] },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: COLORS.text.primary,
    flex: 1,
    marginRight: 12,
  },
  track: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    padding: 2,
  },
  trackActive: {
    backgroundColor: COLORS.primary[500],
  },
  trackInactive: {
    backgroundColor: COLORS.gray[300],
  },
  trackDisabled: {
    backgroundColor: COLORS.gray[200],
    opacity: 0.6,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  thumbActive: {
    backgroundColor: '#fff',
  },
  thumbInactive: {
    backgroundColor: '#fff',
  },
  disabled: {
    opacity: 0.5,
  },
});