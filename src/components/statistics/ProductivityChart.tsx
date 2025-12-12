import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from '@/constants/colors';
import { ModeHistory } from '@/store/modeStore';

interface ProductivityChartProps {
  modeHistory: ModeHistory[];
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({ }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  const getChartData = () => {
    const labels = timeRange === 'week' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : timeRange === 'month'
      ? ['W1', 'W2', 'W3', 'W4']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    const data = labels.map(() => Math.floor(Math.random() * 8) + 2);
    
    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: COLORS.primary[600],
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: COLORS.gray[200],
    },
  };

  const screenWidth = Dimensions.get('window').width - 40;

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ 
          fontSize: 22, 
          fontWeight: '700', 
          color: COLORS.text.primary,
        }}>
          Productivity Trend
        </Text>
        
        <View style={{ flexDirection: 'row', backgroundColor: COLORS.gray[100], borderRadius: 12, padding: 4 }}>
          {(['week', 'month', 'year'] as const).map((range) => (
            <TouchableOpacity
              key={range}
              onPress={() => setTimeRange(range)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: timeRange === range ? COLORS.primary[600] : 'transparent',
              }}
            >
              <Text style={{
                fontSize: 13,
                fontWeight: '600',
                color: timeRange === range ? '#fff' : COLORS.text.secondary,
                textTransform: 'capitalize',
              }}>
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
      }}>
        <LineChart
          data={getChartData()}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
        
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary[600], marginRight: 6 }} />
            <Text style={{ fontSize: 12, color: COLORS.text.secondary }}>Focus Hours</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.gray[300], marginRight: 6 }} />
            <Text style={{ fontSize: 12, color: COLORS.text.secondary }}>Goal (5h/day)</Text>
          </View>
        </View>
      </View>
    </View>
  );
};