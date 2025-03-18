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


import React from 'react';
import { format } from 'date-fns';
import { TimelineEvent } from '@/types/timeline';
import { cn } from '@/lib/utils';
import { 
  CalendarIcon, 
  TagIcon, 
  MapPinIcon,
  Database,
  HardDrive,
  Server,
  Globe,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EventCardProps {
  event: TimelineEvent;
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  onLeave?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  isSelected, 
  isHovered,
  onClick,
  onHover,
  onLeave
}) => {
  // Get the priority class
  const getPriorityClass = () => {
    switch(event.priority) {
      case 'P0': return 'timeline-marker-p0';
      case 'P1': return 'timeline-marker-p1';
      case 'P2': return 'timeline-marker-p2';
      default: return 'timeline-marker-p3';
    }
  };
  
  // Determine the data source icon
  const getDataSourceIcon = () => {
    if (!event.source) return <HardDrive className="h-3 w-3" />;
    
    if (event.source.includes('mysql')) return <Server className="h-3 w-3 text-blue-500" />;
    if (event.source.includes('postgresql')) return <Database className="h-3 w-3 text-indigo-500" />;
    if (event.source.includes('mongodb')) return <Database className="h-3 w-3 text-green-500" />;
    if (event.source.includes('rest')) return <Globe className="h-3 w-3 text-orange-500" />;
    
    return <HardDrive className="h-3 w-3 text-gray-500" />;
  };
  
  // Get source display name
  const getSourceName = () => {
    if (!event.source) return "本地存储";
    
    if (event.source.includes('mysql')) return "MySQL";
    if (event.source.includes('postgresql')) return "PostgreSQL";
    if (event.source.includes('mongodb')) return "MongoDB";
    if (event.source.includes('rest')) return "REST API";
    
    return "本地存储";
  };
  
  return (
    <Card 
      className={cn(
        "w-60 cursor-pointer transition-all duration-200 hover:shadow-md border",
        isSelected ? "ring-2 ring-blue-500 bg-blue-50/50" : "hover:bg-gray-50/50",
        isHovered && !isSelected ? "ring-1 ring-blue-200" : ""
      )}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className={cn("h-1 rounded-t-md", getPriorityClass())}></div>
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-medium text-sm leading-tight">{event.title}</h3>
            
            {/* Data Source Indicator */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="mt-0.5 opacity-60 hover:opacity-100">
                  {getDataSourceIcon()}
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <p>数据源: {getSourceName()}</p>
                  {event.source && <p className="text-[10px] opacity-70">{event.source}</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarIcon className="h-3 w-3 mr-1" />
            <span>{format(event.startDate, 'yyyy-MM-dd')}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPinIcon className="h-3 w-3 mr-1" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          
          {event.tags && event.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-1">
              <TagIcon className="h-3 w-3 text-muted-foreground" />
              {event.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-[9px] px-1 py-0">
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 2 && (
                <Badge variant="outline" className="text-[9px] px-1 py-0">
                  +{event.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
          
          {/* URL Indicator */}
          {event.url && (
            <div className="text-xs flex items-center text-blue-500 hover:text-blue-600 mt-1">
              <ExternalLink className="h-3 w-3 mr-1" />
              <a 
                href={event.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="truncate"
                onClick={(e) => e.stopPropagation()}
              >
                相关链接
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
