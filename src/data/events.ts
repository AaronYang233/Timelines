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

import { TimelineEvent } from '@/types/timeline';

export const sampleEvents: TimelineEvent[] = [
  {
    id: 'WLD-1903-001',
    title: '莱特兄弟首次飞行',
    startDate: new Date('1903-12-17'),
    description: '莱特兄弟在美国北卡罗来纳州成功完成了人类历史上首次受控动力飞行。',
    priority: 'P2',
    timeType: 'gregorian',
    location: '美国北卡罗来纳州基蒂霍克(Kitty Hawk）',
    tags: ['科技', '航空'],
    url: 'https://airandspace.si.edu/exhibitions/wright-brothers/online/fly/1903/'
  },
  {
    id: 'WLD-1914-001',
    title: '第一次世界大战爆发',
    startDate: new Date('1914-07-28'),
    description: '奥匈帝国向塞尔维亚宣战，引发第一次世界大战。',
    priority: 'P0',
    timeType: 'gregorian',
    location: '欧洲',
    tags: ['战争', '国际关系'],
    url: 'https://www.britannica.com/event/World-War-I'
  },
  {
    id: 'WLD-1918-001',
    title: '第一次世界大战结束',
    startDate: new Date('1918-11-11'),
    description: '德国签署《康边停战协定》，1919年签署《凡尔赛条约》，第一次世界大战正式结束。',
    priority: 'P0',
    timeType: 'gregorian',
    location: '法国',
    tags: ['战争', '国际关系']
  },
  {
    id: 'US-1929-001',
    title: '华尔街股灾(黑色星期二事件)',
    startDate: new Date('1929-10-29'),
    description: '美国股市崩盘，导致全球经济大萧条。',
    priority: 'P0',
    timeType: 'gregorian',
    location: '美国华尔街',
    tags: ['经济', '金融危机']
  },
  {
    id: 'WLD-1939-001',
    title: '第二次世界大战爆发',
    startDate: new Date('1939-09-01'),
    description: '德国入侵波兰，标志着第二次世界大战的开始。',
    priority: 'P0',
    timeType: 'gregorian',
    location: '波兰',
    tags: ['战争', '国际关系']
  },
  {
    id: 'US-1941-001',
    title: '珍珠港事件',
    startDate: new Date('1941-12-07'),
    description: '日本突袭美国珍珠港，导致美国正式参与第二次世界大战。',
    priority: 'P0',
    timeType: 'gregorian',
    group: '第二次世界大战',
    location: '夏威夷珍珠港',
    tags: ['战争', '国际关系'],
    url: 'https://zh.wikipedia.org/wiki/珍珠港事件'
  },
  {
    id: 'US-1945-001',
    title: '广岛原子弹爆炸',
    startDate: new Date('1945-08-09'),
    description: '美国在日本广岛投下第一颗原子弹，造成巨大伤亡。',
    priority: 'P0',
    timeType: 'gregorian',
    group: '第二次世界大战',
    location: '日本广岛',
    tags: ['战争', '武器', '科技']
  },
  {
    id: 'WLD-1945-002',
    title: '第二次世界大战结束',
    startDate: new Date('1945-09-02'),
    description: '德国1945年05月07日，签署无条件投降，标志着二战欧洲战场的结束；日本9月2日投降，太平洋战争结束。',
    priority: 'P0',
    timeType: 'gregorian',
    location: '全球',
    tags: ['战争', '国际关系']
  },
  {
    id: 'CN-1949-001',
    title: '中华人民共和国成立',
    startDate: new Date('1949-10-01'),
    description: '毛泽东主席在北京天安门广场宣告中华人民共和国成立，象征着新中国的诞生。',
    priority: 'P0',
    timeType: 'gregorian',
    location: '北京天安门广场',
    tags: ['政治', '国家成立'],
    url: 'https://zh.wikipedia.org/wiki/中华人民共和国成立'
  },
  {
    id: 'WLD-1957-001',
    title: '苏联发射第一颗人造卫星',
    startDate: new Date('1957-10-04'),
    description: '苏联发射人类历史上第一颗人造卫星“斯普特尼克1号”，开启太空时代。',
    priority: 'P1',
    timeType: 'gregorian',
    location: '苏联',
    tags: ['科技', '太空探索']
  },
  {
    id: 'US-1963-001',
    title: '肯尼迪遇刺',
    startDate: new Date('1963-11-22'),
    description: '美国总统约翰·肯尼迪在德克萨斯州达拉斯遭遇暗杀身亡。',
    priority: 'P0',
    timeType: 'gregorian',
    location: '美国达拉斯',
    tags: ['政治', '暗杀']
  },
  {
    id: 'US-1969-001',
    title: '人类首次登月',
    startDate: new Date('1969-07-20'),
    description: '阿波罗11号的宇航员尼尔·阿姆斯特朗成为第一个踏上月球表面的人类。',
    priority: 'P0',
    timeType: 'gregorian',
    location: '月球',
    tags: ['科技', '太空探索'],
    url: 'https://zh.wikipedia.org/wiki/阿波罗11号'
  },
  {
    id: 'WLD-1969-002',
    title: '互联网诞生',
    startDate: new Date('1969-10-29'),
    description: '美国国防部高级研究计划局(ARPA)创建了ARPANET，这是互联网的前身。',
    priority: 'P1',
    timeType: 'gregorian',
    location: '美国',
    tags: ['科技', '通信']
  },
  {
    id: 'CN-1978-001',
    title: '改革开放',
    startDate: new Date('1978-12-18'),
    endDate: new Date('1978-12-22'),
    description: '中国共产党十一届三中全会召开，确立了"以经济建设为中心"的政策，揭开了中国改革开放的序幕。',
    priority: 'P0',
    timeType: 'gregorian',
    location: '北京',
    tags: ['政治', '经济'],
    url: 'https://zh.wikipedia.org/wiki/改革开放'
  },
  {
    id: 'CN-1980-001',
    title: '深圳经济特区成立',
    startDate: new Date('1980-08-26'),
    description: '中国政府批准设立深圳经济特区，成为改革开放的重要窗口。',
    priority: 'P2',
    timeType: 'gregorian',
    location: '深圳',
    relatedEvents: ['CN-1978-001'],
    tags: ['经济', '政策']
  },
  {
    id: 'EU-1989-001',
    title: '柏林墙倒塌',
    startDate: new Date('1989-11-09'),
    description: '标志着冷战结束的重要事件，东德和西德人民可以自由往来。',
    priority: 'P1',
    timeType: 'gregorian',
    location: '德国柏林',
    tags: ['政治', '国际关系']
  },
  {
    id: 'EU-1993-001',
    title: '欧盟成立',
    startDate: new Date('1993-11-01'),
    description: '《马斯特里赫特条约》生效，正式确立了欧洲联盟。',
    priority: 'P1',
    timeType: 'gregorian',
    location: '欧洲',
    tags: ['政治', '国际组织']
  },
  {
    id: 'CN-1997-001',
    title: '香港回归',
    startDate: new Date('1997-07-01'),
    description: '中国政府恢复对香港行使主权，结束了英国对香港的殖民统治。',
    priority: 'P0',
    timeType: 'gregorian',
    location: '香港',
    tags: ['政治', '主权']
  },
  // 21世纪
  {
    id: 'CN-2001-001',
    title: '中国加入WTO',
    description: '中国正式加入世界贸易组织(WTO)，标志着中国进一步融入全球经济体系。',
    startDate: new Date('2001-12-11'),
    endDate: new Date('2001-12-11'),
    priority: 'P1',
    timeType: 'gregorian',
    location: '卡塔尔多哈',
    tags: ['经济', '国际关系'],
    url: 'https://zh.wikipedia.org/wiki/中国加入世界贸易组织'
  },
  {
    id: 'US-2001-002',
    title: '9/11恐怖袭击',
    description: '恐怖分子劫持飞机撞击纽约世贸中心双塔，造成近3000人死亡。',
    startDate: new Date('2001-09-11'),
    endDate: new Date('2001-09-11'),
    priority: 'P0',
    timeType: 'gregorian',
    location: '美国纽约',
    tags: ['恐怖主义', '国际关系']
  },
  {
    id: 'CN-2008-001',
    title: '北京奥运会',
    description: '第29届夏季奥林匹克运动会在北京成功举办，这是奥运会首次在中国举行。',
    startDate: new Date('2008-08-08'),
    endDate: new Date('2008-08-24'),
    priority: 'P1',
    timeType: 'gregorian',
    location: '北京',
    tags: ['体育', '国际活动'],
    url: 'https://zh.wikipedia.org/wiki/2008年夏季奥林匹克运动会'
  },
  {
    id: 'JP-2011-001',
    title: '日本东京大地震',
    description: '日本东北部海域发生9.0级地震，引发海啸和福岛核事故。',
    startDate: new Date('2011-03-11'),
    endDate: new Date('2011-03-11'),
    priority: 'P1',
    timeType: 'gregorian',
    location: '日本东北',
    tags: ['自然灾害', '核能事故']
  },
  {
    id: 'WLD-2016-001',
    title: '英国脱欧公投',
    description: '英国举行全民公投，决定退出欧盟（Brexit）。',
    startDate: new Date('2016-06-23'),
    endDate: new Date('2016-06-23'),
    priority: 'P1',
    timeType: 'gregorian',
    location: '英国',
    tags: ['政治', '国际关系']
  },
  {
    id: 'WLD-2019-001',
    title: 'COVID-19疫情爆发',
    description: '新型冠状病毒肺炎疫情在全球爆发，对世界各国产生深远影响。',
    startDate: new Date('2019-12-01'),
    endDate: new Date('2019-12-01'),
    priority: 'P0',
    timeType: 'gregorian',
    location: '全球',
    tags: ['健康', '公共卫生']
  },
  {
    id: 'WLD-2022-001',
    title: '俄乌战争爆发',
    description: '俄罗斯与乌克兰爆发全面战争，引发全球关注。',
    startDate: new Date('2022-02-24'),
    endDate: new Date('2022-02-24'),
    priority: 'P0',
    timeType: 'gregorian',
    location: '乌克兰',
    tags: ['战争', '国际关系']
  },
  {
    id: 'CN-2022-002',
    title: '中国神舟十四号任务',
    description: '中国神舟十四号载人飞船成功发射，为中国空间站建造作出贡献。',
    startDate: new Date('2022-06-05'),
    endDate: new Date('2022-06-05'),
    priority: 'P1',
    timeType: 'gregorian',
    location: '中国酒泉卫星发射中心',
    tags: ['科技', '太空探索']
  },

];

export const getEvents = (): Promise<TimelineEvent[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleEvents);
    }, 500);
  });
};

export const getFilteredEvents = (filter: {
  startDate?: Date;
  endDate?: Date;
  priority?: string[];
  tags?: string[];
  search?: string;
}): Promise<TimelineEvent[]> => {
  return new Promise((resolve) => {
    let filtered = [...sampleEvents];
    
    if (filter.startDate) {
      filtered = filtered.filter(event => event.startDate >= filter.startDate!);
    }
    
    if (filter.endDate) {
      filtered = filtered.filter(event => event.startDate <= filter.endDate!);
    }
    
    if (filter.priority && filter.priority.length > 0) {
      filtered = filtered.filter(event => filter.priority!.includes(event.priority));
    }
    
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(event => 
        event.tags && event.tags.some(tag => filter.tags!.includes(tag))
      );
    }
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchLower) || 
        event.description.toLowerCase().includes(searchLower) ||
        (event.location && event.location.toLowerCase().includes(searchLower))
      );
    }
    
    setTimeout(() => {
      resolve(filtered);
    }, 300);
  });
};
