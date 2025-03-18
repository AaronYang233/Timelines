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
  MapPinIcon, 
  TagIcon, 
  LinkIcon, 
  X,
  Clock,
  Database,
  ExternalLink,
  HardDrive,
  Server,
  Globe
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface EventDetailProps {
  event: TimelineEvent;
  className?: string;
  onClose?: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, className, onClose }) => {
  // Function to determine priority color
  const getPriorityColor = () => {
    switch(event.priority) {
      case 'P0': return 'bg-gradient-to-r from-red-500 to-orange-500';
      case 'P1': return 'bg-gradient-to-r from-orange-500 to-amber-500';
      case 'P2': return 'bg-gradient-to-r from-blue-500 to-indigo-500';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  // Determine the data source icon
  const getDataSourceIcon = () => {
    if (!event.source) return <HardDrive className="h-4 w-4 text-gray-500" />;
    
    if (event.source.includes('mysql')) return <Server className="h-4 w-4 text-blue-500" />;
    if (event.source.includes('postgresql')) return <Database className="h-4 w-4 text-indigo-500" />;
    if (event.source.includes('mongodb')) return <Database className="h-4 w-4 text-green-500" />;
    if (event.source.includes('rest')) return <Globe className="h-4 w-4 text-orange-500" />;
    
    return <HardDrive className="h-4 w-4 text-gray-500" />;
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
    <Card className={cn(
      "glass-effect w-full max-w-md animate-slide-up backdrop-blur-lg border border-white/20 shadow-lg", 
      className
    )}>
      <div className={cn("h-1 rounded-t-md", getPriorityColor())}></div>
      
      <CardHeader className="pb-2 relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 h-6 w-6 opacity-70 hover:opacity-100" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="mr-8">
          <div className="flex items-center gap-1 mb-1">
            {event.priority.startsWith('P0') && (
              <Badge variant="destructive" className="uppercase text-xs">重要</Badge>
            )}
            {event.group && (
              <Badge variant="outline" className="text-xs">{event.group}</Badge>
            )}
          </div>
          <CardTitle className="text-xl font-medium">{event.title}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{event.description}</p>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4 text-blue-500" />
            <span>{format(event.startDate, 'yyyy年MM月dd日')}</span>
          </div>
          
          {event.endDate && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>{format(event.endDate, 'yyyy年MM月dd日')}</span>
            </div>
          )}
          
          {event.location && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground col-span-2">
              <MapPinIcon className="h-4 w-4 text-red-500" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
        
        {event.tags && event.tags.length > 0 && (
          <div className="flex items-start space-x-2">
            <TagIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {event.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* URL link with hover animation */}
        {event.url && (
          <a 
            href={event.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center space-x-2 py-2 px-3 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm font-medium">访问相关链接</span>
          </a>
        )}
        
        {event.relatedEvents && event.relatedEvents.length > 0 && (
          <div className="flex items-start space-x-2">
            <LinkIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">相关事件:</span>
              <div className="flex flex-wrap gap-1">
                {event.relatedEvents.map((relatedId, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {relatedId}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Enhanced data source footer */}
      <CardFooter className="pt-0">
        <div className="w-full flex items-center justify-start gap-2 text-xs">
          {getDataSourceIcon()}
          <div className="flex flex-col">
            <span className="font-medium">{getSourceName()}</span>
            {event.source && <span className="text-[10px] text-muted-foreground truncate">{event.source}</span>}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventDetail;
