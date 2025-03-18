
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

import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { useTimeline } from '@/contexts/TimelineContext';
import { cn } from '@/lib/utils';

interface TimelineRulerProps {
  className?: string;
}

const TimelineRuler: React.FC<TimelineRulerProps> = ({ className }) => {
  const { state } = useTimeline();
  const { scale, visibleRange } = state;
  
  const markers = useMemo(() => {
    const { start, end } = visibleRange;
    const result = [];
    let current = new Date(start);
    
    // Generate markers based on the current scale
    switch (scale) {
      case 'day':
        while (current <= end) {
          result.push({
            date: new Date(current),
            label: format(current, 'MMM d, yyyy'),
            subLabel: format(current, 'EEEE'),
            isPrimary: current.getDate() === 1, // First day of month is primary
            isSecondary: current.getDay() === 0 || current.getDay() === 6, // Weekends are secondary
          });
          current.setDate(current.getDate() + 1);
        }
        break;
        
      case 'month':
        while (current <= end) {
          result.push({
            date: new Date(current),
            label: format(current, 'MMMM yyyy'),
            subLabel: null,
            isPrimary: current.getMonth() === 0, // First month of year is primary
            isSecondary: (current.getMonth() + 1) % 3 === 0, // Quarter months are secondary
          });
          current.setMonth(current.getMonth() + 1);
        }
        break;
        
      case 'year':
        while (current <= end) {
          result.push({
            date: new Date(current),
            label: format(current, 'yyyy'),
            subLabel: null,
            isPrimary: current.getFullYear() % 10 === 0, // Decade years are primary
            isSecondary: current.getFullYear() % 5 === 0, // Half-decade years are secondary
          });
          current.setFullYear(current.getFullYear() + 1);
        }
        break;
        
      case 'decade':
        const startDecade = Math.floor(start.getFullYear() / 10) * 10;
        const endDecade = Math.floor(end.getFullYear() / 10) * 10;
        
        for (let decade = startDecade; decade <= endDecade; decade += 10) {
          result.push({
            date: new Date(decade, 0, 1),
            label: `${decade}s`,
            subLabel: null,
            isPrimary: decade % 100 === 0, // Century decades are primary
            isSecondary: decade % 50 === 0, // Half-century decades are secondary
          });
        }
        break;
        
      case 'century':
        const startCentury = Math.floor(start.getFullYear() / 100) * 100;
        const endCentury = Math.floor(end.getFullYear() / 100) * 100;
        
        for (let century = startCentury; century <= endCentury; century += 100) {
          result.push({
            date: new Date(century, 0, 1),
            label: `${century}s`,
            subLabel: null,
            isPrimary: century % 1000 === 0, // Millennium centuries are primary
            isSecondary: century % 500 === 0, // Half-millennium centuries are secondary
          });
        }
        break;
        
      // Add other scales as needed
      default:
        while (current <= end) {
          result.push({
            date: new Date(current),
            label: format(current, 'yyyy'),
            subLabel: null,
            isPrimary: false,
            isSecondary: false,
          });
          current.setFullYear(current.getFullYear() + 1);
        }
    }
    
    return result;
  }, [visibleRange, scale]);
  
  // Calculate center marker from all markers
  const centerMarker = useMemo(() => {
    const { centerDate } = state;
    
    // Format the center date based on scale
    let label = '';
    let subLabel = null;
    
    switch (scale) {
      case 'day':
        label = format(centerDate, 'MMMM d, yyyy');
        subLabel = format(centerDate, 'EEEE');
        break;
      case 'month':
        label = format(centerDate, 'MMMM yyyy');
        break;
      case 'year':
        label = format(centerDate, 'yyyy');
        break;
      case 'decade':
        const decade = Math.floor(centerDate.getFullYear() / 10) * 10;
        label = `${decade}s`;
        break;
      case 'century':
        const century = Math.floor(centerDate.getFullYear() / 100) * 100;
        label = `${century}s`;
        break;
      default:
        label = format(centerDate, 'yyyy');
    }
    
    return { label, subLabel };
  }, [state.centerDate, scale]);

  const getTickHeight = (isPrimary: boolean, isSecondary: boolean, isCurrent: boolean) => {
    if (isCurrent) return "h-6";
    if (isPrimary) return "h-5";
    if (isSecondary) return "h-4";
    return "h-3";
  };
  
  const getTickColor = (isPrimary: boolean, isSecondary: boolean, isCurrent: boolean) => {
    if (isCurrent) return "bg-timeline-tick-highlight";
    if (isPrimary) return "bg-timeline-tick-primary";
    if (isSecondary) return "bg-timeline-tick-secondary";
    return "bg-timeline-tick";
  };
  
  return (
    <div className={cn("w-full flex flex-col items-center", className)}>
      {/* Current Center Date Display */}
      <div className="glass-effect px-6 py-2 rounded-full mb-4 animate-fade-in shadow-md">
        <h2 className="text-lg font-medium">{centerMarker.label}</h2>
        {centerMarker.subLabel && (
          <p className="text-sm text-muted-foreground">{centerMarker.subLabel}</p>
        )}
      </div>
      
      {/* Ruler Container with Background */}
      <div className="w-full bg-timeline-ruler-bg rounded-xl p-4 glass-effect shadow-sm">
        {/* Ruler Marks */}
        <div className="w-full h-px bg-timeline-line relative overflow-hidden mb-4">
          <div className="absolute left-1/2 bottom-0 w-1 h-8 bg-timeline-tick-highlight transform -translate-x-1/2 rounded-t-sm transition-all duration-300 z-20"></div>
          
          {markers.map((marker, index) => {
            const isCenter = marker.label === centerMarker.label;
            const { isPrimary, isSecondary } = marker;
            
            return (
              <div 
                key={index}
                className={cn(
                  "absolute bottom-0 w-px transition-all duration-300",
                  getTickHeight(isPrimary, isSecondary, isCenter),
                  getTickColor(isPrimary, isSecondary, isCenter),
                  isCenter && "z-10"
                )}
                style={{ 
                  left: `${(index / (markers.length - 1)) * 100}%`,
                  transform: 'translateX(-50%)'
                }}
              />
            );
          })}
        </div>
        
        {/* Ruler Labels */}
        <div className="w-full flex justify-between px-1">
          {markers.length > 0 && (
            <>
              <div className="text-xs text-muted-foreground font-medium">{markers[0].label}</div>
              {markers.length > 2 && (
                <div className="text-xs text-primary font-medium">
                  {markers[Math.floor(markers.length / 2)].label}
                </div>
              )}
              <div className="text-xs text-muted-foreground font-medium">{markers[markers.length - 1].label}</div>
            </>
          )}
        </div>
      </div>

      {/* Scale Indicator */}
      <div className="mt-2 text-xs text-muted-foreground">
        <span className="px-2 py-0.5 bg-muted rounded-full text-[10px] uppercase tracking-wider">
          {scale} view
        </span>
      </div>
    </div>
  );
};

export default TimelineRuler;
