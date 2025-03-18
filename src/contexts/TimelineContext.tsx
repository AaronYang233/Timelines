/*
 * Copyright 2018-2025 AaronYang <3300390005@qq.com>
 * project: @AaronYang233/Timelines.git
 * URL: www.aaronyang.cc
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { TimelineState, TimelineAction, TimeScale, TimelineEvent, DataSourceConfig } from '@/types/timeline';
import { fetchEventsFromSource } from '@/lib/database/dataSourceConnector';
import { toast } from '@/components/ui/use-toast';

interface TimelineContextType {
  state: TimelineState;
  actions: TimelineAction;
  events: TimelineEvent[];
  isLoading: boolean;
  visibleEvents: TimelineEvent[];
}

const defaultState: TimelineState = {
  currentDate: new Date(),
  centerDate: new Date(),
  scale: 'year',
  visibleRange: {
    start: new Date(new Date().getFullYear() - 5, 0, 1),
    end: new Date(new Date().getFullYear() + 5, 11, 31),
  },
  dataSource: { type: 'local' },
};

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const TimelineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TimelineState>(defaultState);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events when dataSource changes
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEventsFromSource(state.dataSource);
        setEvents(data);
        toast({
          title: '事件加载成功',
          description: `已从${state.dataSource.type === 'local' ? '本地数据源' : state.dataSource.type + '数据源'}加载 ${data.length} 个事件`,
        });
      } catch (error) {
        console.error('Failed to fetch timeline events:', error);
        toast({
          title: '获取事件失败',
          description: '无法从数据源加载事件，请检查连接配置',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [state.dataSource]);

  // Calculate visible date range based on scale
  useEffect(() => {
    const calculateVisibleRange = () => {
      const { centerDate, scale } = state;
      const date = new Date(centerDate);
      let start: Date, end: Date;

      switch (scale) {
        case 'day':
          start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 10);
          end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 10);
          break;
        case 'month':
          start = new Date(date.getFullYear(), date.getMonth() - 6, 1);
          end = new Date(date.getFullYear(), date.getMonth() + 6, 0);
          break;
        case 'year':
          start = new Date(date.getFullYear() - 5, 0, 1);
          end = new Date(date.getFullYear() + 5, 11, 31);
          break;
        case 'decade':
          start = new Date(Math.floor(date.getFullYear() / 10) * 10 - 20, 0, 1);
          end = new Date(Math.floor(date.getFullYear() / 10) * 10 + 30, 11, 31);
          break;
        case 'century':
          start = new Date(Math.floor(date.getFullYear() / 100) * 100 - 100, 0, 1);
          end = new Date(Math.floor(date.getFullYear() / 100) * 100 + 200, 11, 31);
          break;
        default:
          start = new Date(date.getFullYear() - 5, 0, 1);
          end = new Date(date.getFullYear() + 5, 11, 31);
      }

      setState(prev => ({
        ...prev,
        visibleRange: { start, end }
      }));
    };

    calculateVisibleRange();
  }, [state.centerDate, state.scale]);

  // Filter events within the visible range
  const visibleEvents = events.filter(event => {
    const { start, end } = state.visibleRange;
    return event.startDate >= start && event.startDate <= end;
  });

  // Timeline navigation actions
  const navigateToDate = useCallback((date: Date) => {
    setState(prev => ({
      ...prev,
      centerDate: date,
      currentDate: date
    }));
  }, []);

  const zoomIn = useCallback(() => {
    setState(prev => {
      const scaleOrder: TimeScale[] = ['prehistoric', 'era', 'millennium', 'century', 'decade', 'year', 'month', 'day'];
      const currentIndex = scaleOrder.indexOf(prev.scale);
      
      if (currentIndex < scaleOrder.length - 1) {
        return {
          ...prev,
          scale: scaleOrder[currentIndex + 1]
        };
      }
      return prev;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setState(prev => {
      const scaleOrder: TimeScale[] = ['prehistoric', 'era', 'millennium', 'century', 'decade', 'year', 'month', 'day'];
      const currentIndex = scaleOrder.indexOf(prev.scale);
      
      if (currentIndex > 0) {
        return {
          ...prev,
          scale: scaleOrder[currentIndex - 1]
        };
      }
      return prev;
    });
  }, []);

  const setScale = useCallback((scale: TimeScale) => {
    setState(prev => ({
      ...prev,
      scale
    }));
  }, []);

  const selectEvent = useCallback((eventId: string | undefined) => {
    setState(prev => ({
      ...prev,
      selectedEvent: eventId
    }));
  }, []);

  const hoverEvent = useCallback((eventId: string | undefined) => {
    setState(prev => ({
      ...prev,
      hoveredEvent: eventId
    }));
  }, []);

  const setDataSource = useCallback((dataSource: DataSourceConfig) => {
    setState(prev => ({
      ...prev,
      dataSource
    }));
  }, []);

  const actions: TimelineAction = {
    navigateToDate,
    zoomIn,
    zoomOut,
    setScale,
    selectEvent,
    hoverEvent,
    setDataSource
  };

  return (
    <TimelineContext.Provider value={{ state, actions, events, isLoading, visibleEvents }}>
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimeline = (): TimelineContextType => {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return context;
};
