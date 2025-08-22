import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
} from 'react-native';
import { COLORS } from '../../constants/color';

export type FilterOption = {
  key: string;
  label: string;
};

type Props = {
  title?: string; // optional label shown left to dropdown (e.g. "Sort By")
  options: FilterOption[]; // list of options
  selectedKey?: string | null;
  onSelect: (key: string | null, direction: 'asc' | 'desc' | null) => void;
  // allow toggling direction (asc/desc) — default true
  enableDirectionToggle?: boolean;
  initialDirection?: 'asc' | 'desc' | null;
};

const FilterDropdown: React.FC<Props> = ({
  title,
  options,
  selectedKey = null,
  onSelect,
  enableDirectionToggle = true,
  initialDirection = 'asc',
}) => {
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState<'asc' | 'desc' | null>(
    initialDirection
  );

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  };

  const handleChoose = (key: string | null) => {
    // if choose same key — keep direction, otherwise reset direction to initialDirection
    const nextDir = key === selectedKey ? direction : initialDirection;
    onSelect(key, nextDir);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(false);
  };

  const toggleDirection = () => {
    const next = direction === 'asc' ? 'desc' : 'asc';
    setDirection(next);
    onSelect(selectedKey ?? null, next);
  };

  // find label for currently selectedKey
  const selectedLabel =
    options.find((o) => o.key === selectedKey)?.label || 'None';

  return (
    <View style={styles.row}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={toggleOpen}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{selectedLabel}</Text>
          <Text style={styles.icon}>{open ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {enableDirectionToggle && (
          <TouchableOpacity
            style={styles.dirButton}
            onPress={toggleDirection}
            activeOpacity={0.8}
          >
            <Text style={styles.dirText}>
              {direction === 'asc' ? '↑' : '↓'}
            </Text>
            <Text style={styles.dirSmall}>⇵</Text>
          </TouchableOpacity>
        )}
      </View>

      {open && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleChoose(null)}
            activeOpacity={0.7}
          >
            <Text style={styles.itemText}>None</Text>
            <Text style={styles.itemIcon}>↕</Text>
          </TouchableOpacity>

          {options.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.item,
                selectedKey === opt.key && styles.itemSelected,
              ]}
              onPress={() => handleChoose(opt.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.itemText,
                  selectedKey === opt.key && styles.itemTextSelected,
                ]}
              >
                {opt.label}
              </Text>
              <Text style={styles.itemIcon}>
                {selectedKey === opt.key
                  ? direction === 'asc'
                    ? '↑'
                    : '↓'
                  : '⇅'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: '100%',
  },
  title: {
    color: '#f08a00',
    fontWeight: '700',
    marginBottom: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#f2ece2',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      },
      android: { elevation: 1 },
    }),
  },
  buttonText: {
    color: '#666',
    fontSize: 14,
  },
  icon: {
    color: '#888',
    fontSize: 12,
    marginLeft: 8,
  },
  dirButton: {
    width: 48,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6e0d6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dirText: {
    fontSize: 14,
    color: '#666',
  },
  dirSmall: {
    fontSize: 10,
    color: '#bbb',
    marginTop: -2,
  },
  dropdown: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee6dc',
    overflow: 'hidden',
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemSelected: {
    backgroundColor: '#f7f3ee',
  },
  itemText: {
    color: '#333',
    fontSize: 14,
  },
  itemTextSelected: {
    fontWeight: '700',
    color: COLORS.fittoryBlue || '#2a8bd1',
  },
  itemIcon: {
    color: '#999',
    fontSize: 12,
  },
});

export default FilterDropdown;
