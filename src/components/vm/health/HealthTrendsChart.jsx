"use client";

import React, { useState } from 'react';
import { TrendingUp, Calendar, Filter, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HealthTrendsChart = ({ vmId }) => {
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d

  // Mock health trend data - replace with real GraphQL query
  const generateMockData = (days) => {
    const data = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const baseScore = 80 + Math.random() * 15; // Random score between 80-95
      
      data.push({
        date: date.toISOString().split('T')[0],
        score: Math.round(baseScore),
        issues: Math.floor(Math.random() * 5),
        checks: Math.floor(Math.random() * 10) + 5
      });
    }
    
    return data;
  };

  const chartData = generateMockData(timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90);

  const getTimeRangeLabel = (range) => {
    switch (range) {
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 3 Months';
      default: return 'Last 7 Days';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-md">
          <p className="font-medium text-sm mb-1">{label}</p>
          <p className="text-sm text-green-600">
            Health Score: {payload[0].value}
          </p>
          {payload[1] && (
            <p className="text-sm text-muted-foreground">
              Issues: {payload[1].value}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const averageScore = Math.round(
    chartData.reduce((sum, item) => sum + item.score, 0) / chartData.length
  );

  const trend = chartData.length > 1 ? 
    chartData[chartData.length - 1].score - chartData[0].score : 0;

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const getTrendLabel = (trend) => {
    if (trend > 5) return 'Improving';
    if (trend < -5) return 'Declining';
    return 'Stable';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <CardTitle>Health Trends</CardTitle>
            <Badge variant="outline" className="ml-2">
              {getTimeRangeLabel(timeRange)}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant={timeRange === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('7d')}
            >
              7D
            </Button>
            <Button
              variant={timeRange === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('30d')}
            >
              30D
            </Button>
            <Button
              variant={timeRange === '90d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('90d')}
            >
              90D
            </Button>
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="flex items-center gap-6 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{averageScore}</div>
            <div className="text-xs text-muted-foreground">Average Score</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getTrendColor(trend)}`}>
              {trend > 0 ? '+' : ''}{trend}
            </div>
            <div className="text-xs text-muted-foreground">Trend</div>
          </div>
          <div className="text-center">
            <div className={`text-sm font-medium ${getTrendColor(trend)}`}>
              {getTrendLabel(trend)}
            </div>
            <div className="text-xs text-muted-foreground">Overall</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="score" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="score">Health Score</TabsTrigger>
            <TabsTrigger value="issues">Issues Over Time</TabsTrigger>
          </TabsList>
          
          <TabsContent value="score" className="mt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888888"
                    fontSize={12}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis 
                    stroke="#888888"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 inline mr-1" />
                Health score trend over {getTimeRangeLabel(timeRange).toLowerCase()}. 
                Higher scores indicate better system health.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="issues" className="mt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888888"
                    fontSize={12}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis 
                    stroke="#888888"
                    fontSize={12}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-md">
                            <p className="font-medium text-sm mb-1">{label}</p>
                            <p className="text-sm text-red-600">
                              Issues: {payload[0].value}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="issues" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Number of issues detected over {getTimeRangeLabel(timeRange).toLowerCase()}. 
                Lower numbers indicate better system health.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HealthTrendsChart;