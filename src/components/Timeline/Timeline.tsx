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


import React, { useEffect, useRef, useState } from 'react';
import { useTimeline } from '@/contexts/TimelineContext';
import { useTimelineNavigation } from '@/hooks/useTimelineNavigation';
import TimelineRuler from './TimelineRuler';
import EventCard from './EventCard';
import DataSourceSelector from './DataSourceSelector';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Calendar,
  Search,
  List,
  Link as LinkIcon,
  CalendarDays,
  Filter,
  MousePointer,
  History,
  Database,
  HardDrive,
  Server,
  Globe,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TimeScale } from '@/types/timeline';
import { Badge } from '@/components/ui/badge';

interface TimelineProps {
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({ className }) => {
  const { state, actions, visibleEvents, isLoading, events } = useTimeline();
  const { scale, selectedEvent, hoveredEvent, dataSource } = state;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(visibleEvents);
  const [showSourceFilter, setShowSourceFilter] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  
  const {
    containerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleWheel
  } = useTimelineNavigation({ sensitivity: 2, zoomSensitivity: 1 });
  
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Center the timeline on mount
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollLeft = (timelineRef.current.scrollWidth - timelineRef.current.clientWidth) / 2;
    }
  }, []);
  
  // Handle event selection
  const handleEventClick = (eventId: string) => {
    if (selectedEvent === eventId) {
      actions.selectEvent(undefined);
    } else {
      actions.selectEvent(eventId);
      
      // Find the event
      const event = filteredEvents.find(e => e.id === eventId);
      if (event) {
        actions.navigateToDate(event.startDate);
      }
    }
  };
  
  // Get unique data sources from events
  const getDataSources = () => {
    const sources = new Set<string>();
    events.forEach(event => {
      if (!event.source) {
        sources.add('local');
      } else if (event.source.includes('mysql')) {
        sources.add('mysql');
      } else if (event.source.includes('postgresql')) {
        sources.add('postgresql');
      } else if (event.source.includes('mongodb')) {
        sources.add('mongodb');
      } else if (event.source.includes('supabase')) {
        sources.add('supabase');
      } else if (event.source.includes('rest')) {
        sources.add('rest');
      } else {
        sources.add('local');
      }
    });
    return Array.from(sources);
  };
  
  // Initialize selected sources
  useEffect(() => {
    setSelectedSources(getDataSources());
  }, [events]);
  
  // Apply search and source filters
  useEffect(() => {
    let filtered = visibleEvents;
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        event => 
          event.title.toLowerCase().includes(query) || 
          event.description.toLowerCase().includes(query) ||
          (event.location && event.location.toLowerCase().includes(query)) ||
          (event.tags && event.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply source filter
    if (selectedSources.length > 0 && selectedSources.length < getDataSources().length) {
      filtered = filtered.filter(event => {
        if (!event.source && selectedSources.includes('local')) return true;
        if (event.source?.includes('mysql') && selectedSources.includes('mysql')) return true;
        if (event.source?.includes('postgresql') && selectedSources.includes('postgresql')) return true;
        if (event.source?.includes('mongodb') && selectedSources.includes('mongodb')) return true;
        if (event.source?.includes('supabase') && selectedSources.includes('supabase')) return true;
        if (event.source?.includes('rest') && selectedSources.includes('rest')) return true;
        return false;
      });
    }
    
    setFilteredEvents(filtered);
  }, [searchQuery, visibleEvents, selectedSources]);
  
  // Handle scale change
  const handleScaleChange = (scale: TimeScale) => {
    actions.setScale(scale);
  };
  
  // Toggle source selection
  const toggleSource = (source: string) => {
    setSelectedSources(prev => {
      if (prev.includes(source)) {
        return prev.filter(s => s !== source);
      } else {
        return [...prev, source];
      }
    });
  };
  
  // Get source display name and icon
  const getSourceInfo = (source: string) => {
    switch(source) {
      case 'mysql':
        return { name: 'MySQL', icon: <Server className="h-4 w-4 text-blue-500" /> };
      case 'postgresql':
        return { name: 'PostgreSQL', icon: <Database className="h-4 w-4 text-indigo-500" /> };
      case 'mongodb':
        return { name: 'MongoDB', icon: <Database className="h-4 w-4 text-green-500" /> };
      case 'supabase':
        return { name: 'Supabase', icon: <Database className="h-4 w-4 text-emerald-500" /> };
      case 'rest':
        return { name: 'REST API', icon: <Globe className="h-4 w-4 text-orange-500" /> };
      default:
        return { name: '本地存储', icon: <HardDrive className="h-4 w-4 text-gray-500" /> };
    }
  };
  
  // Navigation controls
  const handlePreviousYear = () => {
    const newDate = new Date(state.centerDate);
    if (scale === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (scale === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (scale === 'year') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    } else if (scale === 'decade') {
      newDate.setFullYear(newDate.getFullYear() - 10);
    } else {
      newDate.setFullYear(newDate.getFullYear() - 100);
    }
    actions.navigateToDate(newDate);
  };
  
  const handleNextYear = () => {
    const newDate = new Date(state.centerDate);
    if (scale === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (scale === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (scale === 'year') {
      newDate.setFullYear(newDate.getFullYear() + 1);
    } else if (scale === 'decade') {
      newDate.setFullYear(newDate.getFullYear() + 10);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 100);
    }
    actions.navigateToDate(newDate);
  };
  
  // Get scale display name in Chinese
  const getScaleDisplayName = (scale: TimeScale): string => {
    switch (scale) {
      case 'day': return '日视图';
      case 'month': return '月视图';
      case 'year': return '年视图';
      case 'decade': return '十年视图';
      case 'century': return '世纪视图';
      case 'millennium': return '千年视图';
      case 'era': return '年代视图';
      case 'prehistoric': return '史前视图';
    }
  };
  
  // Render connection status indicator
  const renderConnectionStatus = () => {
    if (!dataSource || dataSource.type === 'local') return null;
    
    if (dataSource.connectionTested === true) {
      if (dataSource.connectionSuccess === true) {
        return (
          <Badge className="absolute -top-1 -left-1 px-1.5 py-px text-[0.6rem] bg-green-500 text-white z-10 flex items-center gap-1">
            <CheckCircle className="h-2 w-2" />
            <span>已连接</span>
          </Badge>
        );
      } else {
        return (
          <Badge className="absolute -top-1 -left-1 px-1.5 py-px text-[0.6rem] bg-red-500 text-white z-10 flex items-center gap-1">
            <AlertTriangle className="h-2 w-2" />
            <span>连接失败</span>
          </Badge>
        );
      }
    }
    
    return null;
  };
  
  return (
    <div className={cn("w-full flex flex-col space-y-4", className)}>
      {/* Control Panel */}
      <div className="glass-effect rounded-xl shadow-md p-2 md:p-4 backdrop-blur-lg border border-white/20">
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
          {/* Data Source & Search */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-1/2">
            <div className="relative">
              <DataSourceSelector 
                currentDataSource={dataSource}
                onDataSourceChange={(ds) => {
                  if (actions.setDataSource) {
                    actions.setDataSource(ds);
                  }
                }}
              />
              {renderConnectionStatus()}
            </div>
            
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索事件（标题、描述、地点或标签）..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-2 glass-effect border-white/20"
              />
              
              {/* Source Filter Button */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={cn(
                        "h-7 w-7 rounded-full",
                        selectedSources.length < getDataSources().length && "bg-blue-100 text-blue-600" 
                      )}
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-effect backdrop-blur-md">
                    <DropdownMenuLabel>筛选数据源</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {getDataSources().map(source => {
                      const { name, icon } = getSourceInfo(source);
                      return (
                        <DropdownMenuCheckboxItem
                          key={source}
                          checked={selectedSources.includes(source)}
                          onCheckedChange={() => toggleSource(source)}
                          className="flex items-center gap-2"
                        >
                          {icon}
                          <span>{name}</span>
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          {/* Timeline Controls */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 w-full md:w-1/2">
            {/* Time Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handlePreviousYear} className="glass-effect border-white/20">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>上一个时间单位</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button 
                variant="outline" 
                className="glass-effect border-white/20 flex items-center gap-2"
                onClick={() => actions.navigateToDate(new Date())}
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">现在</span>
              </Button>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleNextYear} className="glass-effect border-white/20">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>下一个时间单位</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Scale Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* View Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="glass-effect border-white/20 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span className="hidden sm:inline">{getScaleDisplayName(scale)}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-effect backdrop-blur-md">
                  <DropdownMenuItem onClick={() => handleScaleChange('day')}>
                    <Calendar className="h-4 w-4 mr-2" />
                    日视图
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleScaleChange('month')}>
                    <CalendarDays className="h-4 w-4 mr-2" />
                    月视图
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleScaleChange('year')}>
                    <List className="h-4 w-4 mr-2" />
                    年视图
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleScaleChange('decade')}>
                    <List className="h-4 w-4 mr-2" />
                    十年视图
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleScaleChange('century')}>
                    <List className="h-4 w-4 mr-2" />
                    世纪视图
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={actions.zoomOut} className="glass-effect border-white/20">
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>缩小视图</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={actions.zoomIn} className="glass-effect border-white/20">
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>放大视图</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
      
      {/* Timeline Statistics */}
      <div className="flex justify-between items-center text-sm text-muted-foreground px-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            总事件: {events.length}
          </Badge>
          <Badge variant="outline" className="text-xs">
            可见事件: {filteredEvents.length}
          </Badge>
          
          {/* Active Source Filters Display */}
          {selectedSources.length < getDataSources().length && (
            <div className="flex items-center gap-1">
              <span className="text-xs">数据源:</span>
              {selectedSources.map(source => {
                const { name, icon } = getSourceInfo(source);
                return (
                  <Badge key={source} variant="secondary" className="text-xs flex items-center gap-1 px-1.5 py-0.5">
                    {React.cloneElement(icon as React.ReactElement, { className: 'h-3 w-3' })}
                    <span className="hidden sm:inline">{name}</span>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <MousePointer className="h-3 w-3" />
          <span className="text-xs">拖拽浏览，滚轮缩放</span>
        </div>
      </div>
      
      {/* Timeline Ruler */}
      <TimelineRuler />
      
      {/* Timeline Track */}
      <div 
        ref={containerRef}
        className="w-full overflow-x-auto cursor-grab py-8 relative glass-effect rounded-xl shadow-md backdrop-blur-lg border border-white/20"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        <div 
          ref={timelineRef}
          className="w-max min-w-full px-10 flex items-center justify-center relative"
        >
          {/* Center Line with animation */}
          <div className="absolute top-0 left-1/2 h-full w-px bg-gradient-to-b from-rose-500 via-orange-400 to-amber-300 transform -translate-x-1/2 z-0 animate-pulse-soft"></div>
          
          {/* Timeline Events */}
          <div className="flex items-start space-x-4 md:space-x-6 lg:space-x-8 relative z-10">
            {isLoading ? (
              // Loading state
              <div className="flex items-center justify-center h-20 w-full min-w-[300px]">
                <div className="flex flex-col items-center">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                  <p className="text-muted-foreground mt-2">加载事件中...</p>
                </div>
              </div>
            ) : filteredEvents.length === 0 ? (
              // Empty state
              <div className="flex items-center justify-center h-40 w-full min-w-[300px]">
                <div className="text-center">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
                  <p className="text-muted-foreground">未找到符合条件的事件</p>
                  {searchQuery && (
                    <Button 
                      variant="ghost" 
                      className="mt-2 text-blue-500" 
                      onClick={() => setSearchQuery('')}
                    >
                      清除搜索条件
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              // Event cards
              filteredEvents.map((event) => (
                <div 
                  key={event.id} 
                  className={cn(
                    "transform transition-all duration-300",
                    event.priority === 'P0' ? "mt-0" : 
                    event.priority === 'P1' ? "mt-10" : 
                    event.priority === 'P2' ? "mt-20" : "mt-30"
                  )}
                >
                  <EventCard 
                    event={event} 
                    isSelected={event.id === selectedEvent}
                    isHovered={event.id === hoveredEvent}
                    onClick={() => handleEventClick(event.id)}
                    onHover={() => actions.hoverEvent(event.id)}
                    onLeave={() => actions.hoverEvent(undefined)}
                  />
                  
                  {/* URL indicator if present */}
                  {event.url && (
                    <div className="flex justify-center mt-1">
                      <LinkIcon className="h-3 w-3 text-blue-500" />
                    </div>
                  )}
                  
                  {/* Vertical connector line with enhanced animation */}
                  <div className={cn(
                    "h-8 w-px mx-auto transition-all duration-300",
                    event.priority === 'P0' ? "bg-gradient-to-b from-red-500 to-orange-400" : 
                    event.priority === 'P1' ? "bg-gradient-to-b from-orange-400 to-amber-300" : 
                    event.priority === 'P2' ? "bg-gradient-to-b from-blue-500 to-indigo-400" : 
                    "bg-gradient-to-b from-gray-400 to-gray-300"
                  )}></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
