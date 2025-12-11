import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import { MODE_LIST } from '@/constants/modes';
import { useModeStore } from '@/store/modeStore';
import { ModeCard } from '@/components/common/ModeCard';

export const HomeScreen = () => {
  const { activeModes, deactivateAllModes } = useModeStore();
  const isAnyModeActive = activeModes.length > 0;

  return (
    <SafeAreaView style={tw`flex-1 bg-primary-100`}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`bg-prussian-blue-900 px-6 pt-6 pb-8 flex-row justify-between items-center`}>
          <View>
            <Text style={tw`text-3xl font-bold text-prussian-blue-500`}>Quiet Assistant</Text>
            <Text style={tw`text-base text-prussian-blue-100 mt-1`}>
              Stay focused during important moments
            </Text>
          </View>
          <TouchableOpacity style={tw`w-12 h-12 rounded-full bg-white/10 justify-center items-center`}>
            <Icon name="chart-box" size={24} color="" />
          </TouchableOpacity>
        </View>

        {isAnyModeActive && (
          <View style={tw`mx-6 -mt-4 bg-prussian-blue-400 rounded-xl p-4 border-l-4 border-prussian-blue-500 elevation-2`}>
            <View style={tw`flex-row justify-between items-center mb-3`}>
              <View>
                <Text style={tw`text-lg font-semibold text-prussian-blue-900`}>
                  Active Mode{activeModes.length > 1 ? 's' : ''}
                </Text>
                <Text style={tw`text-sm text-prussian-blue-600 mt-1`}>
                  {activeModes.length} mode{activeModes.length > 1 ? 's' : ''} currently active
                </Text>
              </View>
              <TouchableOpacity
                onPress={deactivateAllModes}
                style={tw`bg-red-500 px-4 py-2 rounded-lg`}
              >
                <Text style={tw`text-white font-semibold text-sm`}>Stop All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={tw`flex-row`}
            >
              {activeModes.map((mode) => (
                <View key={mode.id} style={tw`flex-row items-center bg-prussian-blue-500/10 px-3 py-1.5 rounded-full mr-2`}>
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
                  <Text style={tw`text-xs font-semibold text-prussian-blue-700 ml-1.5`}>
                    {mode.type.charAt(0).toUpperCase() + mode.type.slice(1)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={tw`px-6 mt-6`}>
          <Text style={tw`text-2xl font-bold text-success-500 mb-2`}>Quick Start</Text>
          <Text style={tw`text-gray-600`}>
            Select a mode to begin. Your phone will be silenced and auto-replies will be sent.
          </Text>
        </View>

        <View style={tw`px-6 mt-4`}>
          <View style={tw`grid grid-row justify-between`}>
            {MODE_LIST.map((mode) => (
              <ModeCard
                key={mode.id}
                mode={mode}
                style={tw`w-[40%] mb-4`}
              />
            ))}
          </View>
        </View>

        <View style={tw`px-6 mt-8`}>
          <View style={tw`flex-row justify-between items-center mb-3`}>
            <Text style={tw`text-2xl font-bold text-gray-900`}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={tw`text-prussian-blue-500 font-semibold`}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={tw`bg-gray-50 rounded-xl p-4 flex-row items-center`}>
            <Icon name="history" size={24} color={COLORS.gray[500]} />
            <View style={tw`ml-3 flex-1`}>
              <Text style={tw`text-base font-semibold text-gray-900`}>No activity yet</Text>
              <Text style={tw`text-sm text-gray-600 mt-1`}>
                Activate a mode to see your call logs here
              </Text>
            </View>
          </View>
        </View>

        <View style={tw`mx-6 mt-8 mb-8 bg-prussian-blue-50 rounded-xl p-5`}>
          <Text style={tw`text-lg font-bold text-prussian-blue-900 mb-3`}>Quick Tips</Text>
          <View style={tw`flex-row items-center mb-2.5`}>
            <Icon name="check-circle" size={16} color={COLORS.primary[700]} />
            <Text style={tw`text-sm text-prussian-blue-800 ml-2.5 flex-1`}>
              Each mode has customizable messages
            </Text>
          </View>
          <View style={tw`flex-row items-center mb-2.5`}>
            <Icon name="check-circle" size={16} color={COLORS.primary[700]} />
            <Text style={tw`text-sm text-prussian-blue-800 ml-2.5 flex-1`}>
              Set automatic activation by time or location
            </Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <Icon name="check-circle" size={16} color={COLORS.primary[700]} />
            <Text style={tw`text-sm text-prussian-blue-800 ml-2.5 flex-1`}>
              Emergency contacts can bypass modes
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};