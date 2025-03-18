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

import { DataSourceConfig, TimelineEvent } from '@/types/timeline';
import { getEvents as getLocalEvents, getFilteredEvents as getFilteredLocalEvents } from '@/data/events';

/**
 * Test database connection
 */
export const testDatabaseConnection = async (
  dataSource: DataSourceConfig
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!dataSource || dataSource.type === 'local') {
      return { success: true, message: '本地数据源无需测试连接' };
    }

    console.log(`Testing connection to ${dataSource.type} data source`);
    
    // Simulate connection test with different data sources
    switch (dataSource.type) {
      case 'mysql':
        return simulateDatabaseConnectionTest(dataSource, 'MySQL');
      
      case 'postgresql':
        return simulateDatabaseConnectionTest(dataSource, 'PostgreSQL');
      
      case 'mongodb':
        return simulateDatabaseConnectionTest(dataSource, 'MongoDB');
      
      case 'supabase':
        return simulateSupabaseConnectionTest(dataSource);
      
      case 'rest':
        return simulateRestApiConnectionTest(dataSource);
      
      default:
        return { success: false, message: '不支持的数据源类型' };
    }
  } catch (error) {
    console.error('Error testing connection:', error);
    return { 
      success: false, 
      message: error instanceof Error ? `连接测试错误: ${error.message}` : '未知连接错误' 
    };
  }
};

/**
 * Simulate database connection test
 */
const simulateDatabaseConnectionTest = async (
  dataSource: DataSourceConfig,
  dbType: string
): Promise<{ success: boolean; message: string }> => {
  // In a real implementation, this would attempt to connect to the database
  // For simulation purposes, we'll randomly succeed or fail
  const { host, port, database, username } = dataSource.connection || {};
  
  if (!host || !port || !database) {
    return { success: false, message: '缺少必要的连接信息' };
  }
  
  // Success rate: 80%
  const isSuccess = Math.random() > 0.2;
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  if (isSuccess) {
    return { 
      success: true, 
      message: `成功连接到 ${dbType} 数据库 ${host}:${port}/${database}` 
    };
  } else {
    const errorMessages = [
      `无法连接到 ${dbType} 服务器`,
      `${dbType} 身份验证失败`,
      `数据库 '${database}' 不存在`,
      '连接超时'
    ];
    const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    return { success: false, message: randomError };
  }
};

/**
 * Simulate Supabase connection test
 */
const simulateSupabaseConnectionTest = async (
  dataSource: DataSourceConfig
): Promise<{ success: boolean; message: string }> => {
  const { apiEndpoint, connection } = dataSource;
  const apiKey = connection?.apiKey;
  
  if (!apiEndpoint || !apiKey) {
    return { success: false, message: '缺少 Supabase URL 或 API 密钥' };
  }
  
  // Success rate: 90%
  const isSuccess = Math.random() > 0.1;
  
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
  
  if (isSuccess) {
    return { 
      success: true, 
      message: `成功连接到 Supabase 项目 ${apiEndpoint}` 
    };
  } else {
    const errorMessages = [
      'Supabase API 密钥无效',
      'Supabase 项目不存在或无法访问',
      '连接超时'
    ];
    const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    return { success: false, message: randomError };
  }
};

/**
 * Simulate REST API connection test
 */
const simulateRestApiConnectionTest = async (
  dataSource: DataSourceConfig
): Promise<{ success: boolean; message: string }> => {
  const { apiEndpoint } = dataSource;
  
  if (!apiEndpoint) {
    return { success: false, message: '缺少 API 地址' };
  }
  
  // Success rate: 85%
  const isSuccess = Math.random() > 0.15;
  
  await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay
  
  if (isSuccess) {
    return { 
      success: true, 
      message: `成功连接到 REST API ${apiEndpoint}` 
    };
  } else {
    const errorMessages = [
      'API 服务器无响应',
      'API 路径不存在',
      '未授权访问 API',
      '连接超时'
    ];
    const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    return { success: false, message: randomError };
  }
};

/**
 * Connect to different data sources and fetch timeline events
 */
export const fetchEventsFromSource = async (
  dataSource: DataSourceConfig | undefined,
  filter?: {
    startDate?: Date;
    endDate?: Date;
    priority?: string[];
    tags?: string[];
    search?: string;
  }
): Promise<TimelineEvent[]> => {
  try {
    // Always fetch local events first
    let localEvents = filter ? 
      await getFilteredLocalEvents(filter) : 
      await getLocalEvents();
    
    // Mark local events with source
    localEvents = localEvents.map(event => ({
      ...event,
      source: event.source || '本地存储'
    }));

    // If no data source is specified or it's local, just return local events
    if (!dataSource || dataSource.type === 'local') {
      return localEvents;
    }
    
    // Skip fetching from external sources if connection test failed
    if (dataSource.connectionTested === true && dataSource.connectionSuccess === false) {
      console.warn(`Skipping fetch from ${dataSource.type} due to failed connection test`);
      return localEvents;
    }

    // For other data sources, fetch from them and merge with local events
    console.log(`Fetching events from ${dataSource.type} data source`);
    let externalEvents: TimelineEvent[] = [];
    
    switch (dataSource.type) {
      case 'mysql':
        console.log('Connecting to MySQL database', dataSource.connection);
        externalEvents = await fetchFromDatabase(dataSource, filter);
        break;
      
      case 'postgresql':
        console.log('Connecting to PostgreSQL database', dataSource.connection);
        externalEvents = await fetchFromDatabase(dataSource, filter);
        break;
      
      case 'mongodb':
        console.log('Connecting to MongoDB database', dataSource.connection);
        externalEvents = await fetchFromDatabase(dataSource, filter);
        break;
      
      case 'supabase':
        console.log('Connecting to Supabase', dataSource.apiEndpoint);
        externalEvents = await fetchFromSupabase(dataSource, filter);
        break;
      
      case 'rest':
        externalEvents = await fetchFromRestApi(dataSource, filter);
        break;
      
      default:
        console.warn('Unsupported data source type');
        break;
    }
    
    // Merge local and external events
    console.log(`Merging ${localEvents.length} local events with ${externalEvents.length} external events`);
    return [...localEvents, ...externalEvents];
  } catch (error) {
    console.error('Error fetching events from data source:', error);
    throw new Error(`Failed to fetch events from ${dataSource?.type} data source`);
  }
};

/**
 * Fetch from database sources (MySQL, PostgreSQL, MongoDB)
 */
const fetchFromDatabase = async (
  dataSource: DataSourceConfig,
  filter?: {
    startDate?: Date;
    endDate?: Date;
    priority?: string[];
    tags?: string[];
    search?: string;
  }
): Promise<TimelineEvent[]> => {
  // In a real implementation, this would:
  // 1. Connect to the database using the provided credentials
  // 2. Construct a query based on the filter parameters
  // 3. Execute the query and parse the results
  
  const tableNames = dataSource.tableNames || [dataSource.tableName || 'timeline_events'];
  console.log(`Fetching from ${dataSource.type} with tables: ${tableNames.join(', ')}`);
  
  // For now, just return simulated events after a delay to simulate network latency
  return new Promise((resolve) => {
    setTimeout(async () => {
      let allEvents: TimelineEvent[] = [];
      
      // Create source string based on database type
      let sourcePrefix: string;
      switch (dataSource.type) {
        case 'mysql':
          sourcePrefix = `mysql://${dataSource.connection?.host || 'localhost'}:${dataSource.connection?.port || '3306'}`;
          break;
        case 'postgresql':
          sourcePrefix = `postgresql://${dataSource.connection?.host || 'localhost'}:${dataSource.connection?.port || '5432'}`;
          break;
        case 'mongodb':
          sourcePrefix = `mongodb://${dataSource.connection?.host || 'localhost'}:${dataSource.connection?.port || '27017'}`;
          break;
        default:
          sourcePrefix = `${dataSource.type}://`;
      }
      
      const dbPath = dataSource.connection?.database 
        ? `/${dataSource.connection.database}` 
        : '';
      
      // Generate events for each table
      for (const tableName of tableNames) {
        const sourceString = `${sourcePrefix}${dbPath}/${tableName}`;
        
        // Generate some events for this table
        const baseEvents = await getLocalEvents();
        const tableIndex = tableNames.indexOf(tableName);
        const startIndex = (tableIndex * 3) % baseEvents.length;
        const sampleEvents = baseEvents.slice(startIndex, startIndex + 3); 
        
        // Create unique events for this table
        const tableEvents = sampleEvents.map((event, index) => {
          const startYear = new Date().getFullYear() - Math.floor(Math.random() * 10);
          const startMonth = Math.floor(Math.random() * 12);
          const startDay = Math.floor(Math.random() * 28) + 1;
          
          return {
            ...event,
            id: `${dataSource.type}-${tableName}-${index}-${Date.now()}`,
            title: `${dataSource.type.toUpperCase()} ${tableName} - ${event.title}`,
            description: `从 ${dataSource.type} 数据库表 ${tableName} 获取的事件: ${event.description}`,
            startDate: new Date(startYear, startMonth, startDay),
            source: sourceString
          };
        });
        
        allEvents = [...allEvents, ...tableEvents];
      }
      
      resolve(allEvents);
    }, 800);
  });
};

/**
 * Fetch events from Supabase
 */
const fetchFromSupabase = async (
  dataSource: DataSourceConfig,
  filter?: {
    startDate?: Date;
    endDate?: Date;
    priority?: string[];
    tags?: string[];
    search?: string;
  }
): Promise<TimelineEvent[]> => {
  if (!dataSource.apiEndpoint || !dataSource.connection?.apiKey) {
    throw new Error('Supabase URL or API key not specified');
  }
  
  const tableNames = dataSource.tableNames || ['timeline_events'];
  console.log(`Fetching from Supabase with tables: ${tableNames.join(', ')}`);
  
  // For now, simulate a Supabase call
  return new Promise((resolve) => {
    setTimeout(async () => {
      let allEvents: TimelineEvent[] = [];
      
      // Create a realistic-looking Supabase source string
      const supabaseUrl = dataSource.apiEndpoint;
      
      // For each table, generate some events
      for (const tableName of tableNames) {
        const sourceString = `supabase://${supabaseUrl.replace(/^https?:\/\//, '')}/${tableName}`;
        
        // Generate some events for this table
        const baseEvents = await getLocalEvents();
        const tableIndex = tableNames.indexOf(tableName);
        const startIndex = (tableIndex * 3 + 2) % baseEvents.length;
        const sampleEvents = baseEvents.slice(startIndex, startIndex + 3);
        
        // Create unique events for this table
        const tableEvents = sampleEvents.map((event, index) => {
          const startYear = new Date().getFullYear() - Math.floor(Math.random() * 10);
          const startMonth = Math.floor(Math.random() * 12);
          const startDay = Math.floor(Math.random() * 28) + 1;
          
          return {
            ...event,
            id: `supabase-${tableName}-${index}-${Date.now()}`,
            title: `Supabase ${tableName} - ${event.title}`,
            description: `从 Supabase 表 ${tableName} 获取的事件: ${event.description}`,
            startDate: new Date(startYear, startMonth, startDay),
            source: sourceString
          };
        });
        
        allEvents = [...allEvents, ...tableEvents];
      }
      
      resolve(allEvents);
    }, 1000);
  });
};

/**
 * Fetch events from a REST API
 */
const fetchFromRestApi = async (
  dataSource: DataSourceConfig,
  filter?: {
    startDate?: Date;
    endDate?: Date;
    priority?: string[];
    tags?: string[];
    search?: string;
  }
): Promise<TimelineEvent[]> => {
  if (!dataSource.apiEndpoint) {
    throw new Error('API endpoint not specified for REST data source');
  }
  
  // In a real implementation, we would:
  // 1. Construct the API URL with query parameters based on the filter
  // 2. Make a fetch request
  // 3. Parse the JSON response
  
  console.log(`Fetching from REST API: ${dataSource.apiEndpoint}`);
  
  // For now, simulate an API call
  return new Promise((resolve) => {
    setTimeout(async () => {
      const baseEvents = await getLocalEvents();
      const sampleEvents = baseEvents.slice(5, 10);  // Take some events as templates
      
      // Create a realistic-looking REST API source string
      const apiUrl = dataSource.apiEndpoint?.startsWith('http') 
        ? dataSource.apiEndpoint 
        : `https://${dataSource.apiEndpoint}`;
      
      // Create unique events for this REST API
      const apiEvents = sampleEvents.map((event, index) => {
        const startYear = new Date().getFullYear() - Math.floor(Math.random() * 5);
        const startMonth = Math.floor(Math.random() * 12);
        const startDay = Math.floor(Math.random() * 28) + 1;
        
        return {
          ...event,
          id: `rest-api-${index}-${Date.now()}`,  // Ensure unique IDs
          title: `API - ${event.title}`,
          description: `从 REST API 获取的事件: ${event.description}`,
          startDate: new Date(startYear, startMonth, startDay),
          source: `rest://${apiUrl}/events`
        };
      });
      
      resolve(apiEvents);
    }, 1000);
  });
};
