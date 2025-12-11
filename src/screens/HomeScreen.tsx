import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
// import { useTailwind } from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import { MODE_LIST } from '@/constants/modes';
import { useModeStore } from '@/store/modeStore';
import { ModeCard } from '@/components/common/ModeCard';

export const HomeScreen = () => {
//   const tw = useTailwind();
  const { activeModes, deactivateAllModes } = useModeStore();
  
  const isAnyModeActive = activeModes.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Quiet Assistant</Text>
            <Text style={styles.headerSubtitle}>
              Stay focused during important moments
            </Text>
          </View>
          <TouchableOpacity style={styles.statsButton}>
            <Icon name="chart-box" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Active Modes Banner */}
        {isAnyModeActive && (
          <View style={styles.activeModesBanner}>
            <View style={styles.activeModesContent}>
              <View>
                <Text style={styles.activeModesTitle}>
                  Active Mode{activeModes.length > 1 ? 's' : ''}
                </Text>
                <Text style={styles.activeModesSubtitle}>
                  {activeModes.length} mode{activeModes.length > 1 ? 's' : ''} currently active
                </Text>
              </View>
              <TouchableOpacity
                onPress={deactivateAllModes}
                style={styles.stopAllButton}
              >
                <Text style={styles.stopAllText}>Stop All</Text>
              </TouchableOpacity>
            </View>
            
            {/* Active modes list */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.activeModesScroll}
            >
              {activeModes.map((mode) => (
                <View key={mode.id} style={styles.activeModeTag}>
                  <Icon 
                    name={
                      mode.type === 'prayer' ? 'mosque' :
                      mode.type === 'meeting' ? 'account-group' :
                      mode.type === 'nap' ? 'sleep' :
                      mode.type === 'study' ? 'book-education' : 'cog'
                    }
                    size={16}
                    color={COLORS.primary[600]}
                  />
                  <Text style={styles.activeModeText}>
                    {mode.type.charAt(0).toUpperCase() + mode.type.slice(1)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <Text style={styles.sectionSubtitle}>
            Select a mode to begin. Your phone will be silenced and auto-replies will be sent.
          </Text>
        </View>

        {/* Mode Grid */}
        <View style={styles.modesGrid}>
          {MODE_LIST.map((mode) => (
            <ModeCard
              key={mode.id}
              mode={mode}
              style={styles.modeCard}
            />
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityCard}>
            <Icon name="history" size={24} color={COLORS.gray[500]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>No activity yet</Text>
              <Text style={styles.activityText}>
                Activate a mode to see your call logs here
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Quick Tips</Text>
          <View style={styles.tipItem}>
            <Icon name="check-circle" size={16} color={COLORS.success[500]} />
            <Text style={styles.tipText}>Each mode has customizable messages</Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="check-circle" size={16} color={COLORS.success[500]} />
            <Text style={styles.tipText}>Set automatic activation by time or location</Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="check-circle" size={16} color={COLORS.success[500]} />
            <Text style={styles.tipText}>Emergency contacts can bypass modes</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary[900],
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.primary[100],
    marginTop: 4,
  },
  statsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeModesBanner: {
    backgroundColor: COLORS.primary[50],
    marginHorizontal: 24,
    marginTop: -16,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary[500],
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  activeModesContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeModesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary[900],
  },
  activeModesSubtitle: {
    fontSize: 14,
    color: COLORS.primary[600],
    marginTop: 2,
  },
  stopAllButton: {
    backgroundColor: COLORS.error[500],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  stopAllText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  activeModesScroll: {
    flexDirection: 'row',
  },
  activeModeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 116, 210, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  activeModeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary[700],
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  seeAllText: {
    color: COLORS.primary[500],
    fontWeight: '600',
  },
  modesGrid: {
    paddingHorizontal: 24,
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modeCard: {
    width: '48%',
    marginBottom: 16,
  },
  activityCard: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  activityText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  tipsContainer: {
    margin: 24,
    marginTop: 32,
    backgroundColor: COLORS.primary[50],
    borderRadius: 16,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary[900],
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.primary[800],
    flex: 1,
  },
});