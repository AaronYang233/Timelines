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

import { useCallback, useRef, useState, useEffect } from 'react';
import { useTimeline } from '@/contexts/TimelineContext';

interface UseTimelineNavigationProps {
  sensitivity?: number;
  zoomSensitivity?: number;
}

export function useTimelineNavigation({
  sensitivity = 1,
  zoomSensitivity = 1
}: UseTimelineNavigationProps = {}) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { state, actions } = useTimeline();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { centerDate, scale } = state;
      const newDate = new Date(centerDate);
      
      // Time step based on scale and modifier keys
      let timeStep = 1;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        
        const direction = e.key === 'ArrowLeft' ? -1 : 1;
        
        // Determine time step based on scale and modifier keys
        if (e.shiftKey && e.ctrlKey) {
          // Decade step
          timeStep = 10 * 365;
        } else if (e.ctrlKey) {
          // Year step
          timeStep = 365;
        } else if (e.shiftKey) {
          // Month step
          timeStep = 30;
        } else {
          // Day step
          timeStep = 1;
        }
        
        // Apply the time step
        newDate.setDate(newDate.getDate() + direction * timeStep);
        actions.navigateToDate(newDate);
      }
      
      // Zoom controls with up/down arrows
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        actions.zoomIn();
      }
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        actions.zoomOut();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state, actions]);

  // Mouse and touch event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    containerRef.current.style.cursor = 'grabbing';
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * sensitivity; // Sensitivity multiplier
    containerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft, sensitivity]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
      }
    }
  }, [isDragging]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.deltaY !== 0) {
      // Vertical scrolling for zoom
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if (e.deltaY < 0) {
          actions.zoomIn();
        } else {
          actions.zoomOut();
        }
      }
    }
    
    if (e.deltaX !== 0 && containerRef.current) {
      // Horizontal scrolling for timeline navigation
      containerRef.current.scrollLeft += e.deltaX;
    }
  }, [actions]);

  return {
    containerRef,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleWheel
  };
}
