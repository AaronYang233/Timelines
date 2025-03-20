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
import TimelineContainer from '@/components/Timeline/TimelineContainer';
import { useTimeline, TimelineProvider } from '@/contexts/TimelineContext';
import EventDetail from '@/components/Timeline/EventDetail';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  GanttChartSquare, History, LayoutDashboard, Database, Github 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TimelineContent = () => {
  const { state, actions, events } = useTimeline();
  const selectedEventData = state.selectedEvent ? events.find(e => e.id === state.selectedEvent) : null;

  return (
    <div className="space-y-8">
      <div className={cn("transition-all duration-500", selectedEventData && "pb-64")}>
        <TimelineContainer />
      </div>
      
      {selectedEventData && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-50">
          <EventDetail event={selectedEventData} onClose={() => actions.selectEvent(undefined)} />
        </div>
      )}
    </div>
  );
};

const Index = () => {
  const databases = ["MySQL", "PostgreSQL", "MongoDB", "Supabase"];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-white to-indigo-50 animate-gradient-background">
      
      {/* Header */}
      <header className="p-6 md:p-8 lg:p-10 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/40 via-sky-100/40 to-indigo-100/40 z-0"></div>
        <div className="relative z-10">
          <div className="inline-block mb-2">
            <div className="text-4xl uppercase tracking-widest text-muted-foreground glass-effect px-3 py-1 rounded-full border border-white/20 shadow-sm backdrop-blur-sm flex items-center gap-2 shimmer">
              <GanttChartSquare className="h-10 w-10" />
              <span>交互式时间轴</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600">
            {["历", "史", "时", "间", "轴", "系", "统"].map((char, i) => (
              <span key={i} className="floating inline-block" style={{ animationDelay: `${i * 0.1}s` }}>
                {char}
              </span>
            ))}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            探索历史事件，体验交互式时间轴，支持多种数据源整合，
            <Badge className="ml-1 bg-gradient-to-r from-blue-500 to-purple-500">全新版本</Badge> 
            支持数据合并显示功能。
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {databases.map((db, i) => (
              <Badge key={i} variant="outline" className="flex items-center gap-1 px-2">
                <Database className="h-3 w-3" />
                {db}
              </Badge>
            ))}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 container px-4 md:px-6 pb-20">
        <TimelineProvider>
          <TimelineContent />
        </TimelineProvider>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-4 border-t border-gray-100 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            交互式水平时间轴系统 © {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-4">
            {[
              { icon: History, text: "功能历史" },
              { icon: LayoutDashboard, text: "仪表盘" },
              { icon: Github, text: "源代码", link: "https://github.com/AaronYang233/Timelines.git" },
            ].map(({ icon: Icon, text, link }, i) => (
              <Button 
                key={i} 
                variant="ghost" 
                size="sm" 
                className="text-xs text-muted-foreground flex items-center gap-1"
                onClick={link ? () => window.open(link, '_blank') : undefined}
              >
                <Icon className="h-3 w-3" />
                <span>{text}</span>
              </Button>
            ))}
          </div>
        </div>
      </footer>
      
    </div>
  );
};

export default Index;