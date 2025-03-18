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

export type TimeScale = 'day' | 'month' | 'year' | 'decade' | 'century' | 'millennium' | 'era' | 'prehistoric';

export type EventPriority = 'P0' | 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7' | 'P8' | 'P9';

export type TimeType = 'gregorian' | 'lunar' | 'islamic';

// Add data source types
export type DataSourceType = 'local' | 'mysql' | 'postgresql' | 'mongodb' | 'rest' | 'supabase';

export interface DataSourceConfig {
  type: DataSourceType;
  connection?: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database?: string;
    url?: string;
    apiKey?: string; // For Supabase
  };
  tableName?: string;
  tableNames?: string[]; // Support for multiple tables
  apiEndpoint?: string;
  connectionTested?: boolean; // Track if connection has been tested
  connectionSuccess?: boolean; // Track if connection test was successful
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  priority: EventPriority;
  timeType: TimeType;
  group?: string;
  tags?: string[];
  relatedEvents?: string[];
  conflictFlag?: boolean;
  version?: string;
  location?: string;
  url?: string;
  imageUrl?: string;
  source?: string;
}

export interface TimelineGroup {
  id: string;
  name: string;
  description?: string;
}

export interface TimelineCollection {
  id: string;
  name: string;
  description?: string;
  dataSource?: DataSourceConfig;
}

export interface TimelineState {
  currentDate: Date;
  centerDate: Date;
  scale: TimeScale;
  visibleRange: {
    start: Date;
    end: Date;
  };
  selectedEvent?: string;
  hoveredEvent?: string;
  dataSource?: DataSourceConfig;
}

export interface TimelineAction {
  navigateToDate: (date: Date) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setScale: (scale: TimeScale) => void;
  selectEvent: (eventId: string | undefined) => void;
  hoverEvent: (eventId: string | undefined) => void;
  setDataSource?: (dataSource: DataSourceConfig) => void;
}
