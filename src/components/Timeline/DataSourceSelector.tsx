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


import React, { useState } from 'react';
import { DataSourceConfig, DataSourceType } from '@/types/timeline';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  DatabaseIcon, 
  ServerIcon, 
  Database, 
  Globe, 
  Check, 
  AlertCircle, 
  Plus,
  Trash,
  RefreshCw
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Badge } from "@/components/ui/badge";
import { testDatabaseConnection } from '@/lib/database/dataSourceConnector';

interface DataSourceSelectorProps {
  currentDataSource?: DataSourceConfig;
  onDataSourceChange: (dataSource: DataSourceConfig) => void;
}

const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({
  currentDataSource,
  onDataSourceChange
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<DataSourceType>(
    currentDataSource?.type || 'local'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
  }>({
    tested: false,
    success: false,
    message: '',
  });
  
  const [formData, setFormData] = useState<{
    host: string;
    port: string;
    database: string;
    username: string;
    password: string;
    tableNames: string[];
    apiEndpoint: string;
    apiKey: string;
  }>({
    host: currentDataSource?.connection?.host || 'localhost',
    port: currentDataSource?.connection?.port?.toString() || getDefaultPort(selectedType),
    database: currentDataSource?.connection?.database || 'timeline_db',
    username: currentDataSource?.connection?.username || '',
    password: currentDataSource?.connection?.password || '',
    tableNames: currentDataSource?.tableNames || ['timeline_events'],
    apiEndpoint: currentDataSource?.apiEndpoint || '',
    apiKey: currentDataSource?.connection?.apiKey || '',
  });

  function getDefaultPort(type: DataSourceType): string {
    switch (type) {
      case 'mysql': return '3306';
      case 'postgresql': return '5432';
      case 'mongodb': return '27017';
      case 'supabase': return '5432'; // Supabase uses PostgreSQL under the hood
      default: return '';
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTableNameChange = (index: number, value: string) => {
    const updatedTableNames = [...formData.tableNames];
    updatedTableNames[index] = value;
    setFormData({
      ...formData,
      tableNames: updatedTableNames,
    });
  };

  const addTableName = () => {
    setFormData({
      ...formData,
      tableNames: [...formData.tableNames, 'new_table'],
    });
  };

  const removeTableName = (index: number) => {
    if (formData.tableNames.length <= 1) return;
    const updatedTableNames = [...formData.tableNames];
    updatedTableNames.splice(index, 1);
    setFormData({
      ...formData,
      tableNames: updatedTableNames,
    });
  };

  const testConnection = async () => {
    try {
      setIsTesting(true);
      setConnectionStatus({
        tested: false,
        success: false,
        message: '',
      });

      // Validate form data for the test
      if (selectedType !== 'local' && selectedType !== 'rest') {
        if (!formData.host || !formData.port || !formData.database) {
          toast({
            title: '输入错误',
            description: '请填写所有必填字段',
            variant: 'destructive',
          });
          setIsTesting(false);
          return;
        }
      }
      
      if (selectedType === 'rest' && !formData.apiEndpoint) {
        toast({
          title: '输入错误',
          description: '请填写 API 地址',
          variant: 'destructive',
        });
        setIsTesting(false);
        return;
      }
      
      if (selectedType === 'supabase' && !formData.apiKey) {
        toast({
          title: '输入错误',
          description: '请填写 Supabase API 密钥',
          variant: 'destructive',
        });
        setIsTesting(false);
        return;
      }

      // Construct the data source config for testing
      const config: DataSourceConfig = {
        type: selectedType,
      };

      if (selectedType === 'rest') {
        config.apiEndpoint = formData.apiEndpoint;
      } else if (selectedType === 'supabase') {
        config.apiEndpoint = formData.apiEndpoint;
        config.connection = {
          apiKey: formData.apiKey,
          database: formData.database
        };
        config.tableNames = formData.tableNames;
      } else if (selectedType !== 'local') {
        config.connection = {
          host: formData.host,
          port: parseInt(formData.port) || undefined,
          database: formData.database,
          username: formData.username,
          password: formData.password,
        };
        config.tableNames = formData.tableNames;
      }

      // Test the connection
      const result = await testDatabaseConnection(config);
      
      setConnectionStatus({
        tested: true,
        success: result.success,
        message: result.message,
      });
      
      if (result.success) {
        toast({
          title: '连接测试成功',
          description: result.message,
        });
      } else {
        toast({
          title: '连接测试失败',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      setConnectionStatus({
        tested: true,
        success: false,
        message: error instanceof Error ? error.message : '未知错误',
      });
      toast({
        title: '连接测试出错',
        description: '测试连接时出现错误，请检查输入',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate form data
      if (selectedType !== 'local' && selectedType !== 'rest' && selectedType !== 'supabase') {
        if (!formData.host || !formData.port || !formData.database) {
          toast({
            title: '输入错误',
            description: '请填写所有必填字段',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      if (selectedType === 'rest' && !formData.apiEndpoint) {
        toast({
          title: '输入错误',
          description: '请填写 API 地址',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      if (selectedType === 'supabase') {
        if (!formData.apiEndpoint || !formData.apiKey) {
          toast({
            title: '输入错误',
            description: '请填写 Supabase URL 和 API 密钥',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Construct the data source config
      const config: DataSourceConfig = {
        type: selectedType,
      };

      if (selectedType === 'rest') {
        config.apiEndpoint = formData.apiEndpoint;
      } else if (selectedType === 'supabase') {
        config.apiEndpoint = formData.apiEndpoint;
        config.connection = {
          apiKey: formData.apiKey,
          database: formData.database
        };
        config.tableNames = formData.tableNames;
      } else if (selectedType !== 'local') {
        config.connection = {
          host: formData.host,
          port: parseInt(formData.port) || undefined,
          database: formData.database,
          username: formData.username,
          password: formData.password,
        };
        config.tableNames = formData.tableNames;
      }
      
      // If the connection has been tested, include the status
      if (connectionStatus.tested) {
        config.connectionTested = true;
        config.connectionSuccess = connectionStatus.success;
      }

      // Apply the new data source
      onDataSourceChange(config);
      setShowDialog(false);
      
      toast({
        title: '数据源更新成功',
        description: `已连接到 ${getDataSourceLabel(selectedType)} 数据源，数据已合并显示`,
      });
    } catch (error) {
      console.error('Error configuring data source:', error);
      toast({
        title: '数据源配置错误',
        description: '配置数据源时出现错误，请检查输入',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDataSourceLabel = (type: DataSourceType): string => {
    switch (type) {
      case 'local': return '本地数据';
      case 'mysql': return 'MySQL';
      case 'postgresql': return 'PostgreSQL';
      case 'mongodb': return 'MongoDB';
      case 'rest': return 'REST API';
      case 'supabase': return 'Supabase';
      default: return '未知数据源';
    }
  };

  const getDataSourceIcon = (type: DataSourceType) => {
    switch (type) {
      case 'local':
        return <DatabaseIcon className="h-4 w-4 mr-2 datasource-icon-local" />;
      case 'mysql':
        return <Database className="h-4 w-4 mr-2 datasource-icon-mysql" />;
      case 'postgresql':
        return <Database className="h-4 w-4 mr-2 datasource-icon-postgresql" />;
      case 'mongodb':
        return <ServerIcon className="h-4 w-4 mr-2 datasource-icon-mongodb" />;
      case 'rest':
        return <Globe className="h-4 w-4 mr-2 datasource-icon-rest" />;
      case 'supabase':
        return <Database className="h-4 w-4 mr-2 text-green-500" />;
      default:
        return <DatabaseIcon className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="gap-2 hover:bg-muted/80 glass-effect shadow-sm group relative overflow-hidden"
          >
            <Badge className="absolute -top-1 -right-1 px-1.5 py-px text-[0.6rem] bg-indigo-500 text-white z-10">
              合并
            </Badge>
            <div className="flex items-center">
              {getDataSourceIcon(currentDataSource?.type || 'local')}
              <span className="hidden sm:inline">{getDataSourceLabel(currentDataSource?.type || 'local')}</span>
            </div>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-200/20 to-blue-100/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></span>
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md glass-effect backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Badge className="bg-indigo-500 text-white">新功能</Badge>
              配置数据源
            </DialogTitle>
            <DialogDescription>
              连接数据库或API获取事件数据，与本地数据合并显示
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium mb-1.5">数据源说明</Label>
              <div className="p-3 rounded-md bg-blue-50/50 border border-blue-100 text-sm">
                选择数据源类型后，系统将合并显示不同来源的事件数据。
                本地数据将始终保留，数据库中的事件将被添加到时间轴中。
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="datasource-type" className="text-right">
                数据源类型
              </Label>
              <Select 
                value={selectedType} 
                onValueChange={(value) => {
                  setSelectedType(value as DataSourceType);
                  // Reset connection status when type changes
                  setConnectionStatus({
                    tested: false,
                    success: false,
                    message: ''
                  });
                  // Update default port
                  setFormData(prev => ({
                    ...prev,
                    port: getDefaultPort(value as DataSourceType)
                  }));
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择数据源类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <DatabaseIcon className="h-4 w-4 text-gray-500" />
                      本地数据
                    </div>
                  </SelectItem>
                  <SelectItem value="mysql">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-500" />
                      MySQL
                    </div>
                  </SelectItem>
                  <SelectItem value="postgresql">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-indigo-500" />
                      PostgreSQL
                    </div>
                  </SelectItem>
                  <SelectItem value="mongodb">
                    <div className="flex items-center gap-2">
                      <ServerIcon className="h-4 w-4 text-green-500" />
                      MongoDB
                    </div>
                  </SelectItem>
                  <SelectItem value="supabase">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-green-500" />
                      Supabase
                    </div>
                  </SelectItem>
                  <SelectItem value="rest">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-orange-500" />
                      REST API
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Database connection settings */}
            {selectedType !== 'local' && selectedType !== 'rest' && selectedType !== 'supabase' && (
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium mb-3">数据库连接设置</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="host" className="text-right text-xs">
                      服务器地址
                    </Label>
                    <Input
                      id="host"
                      name="host"
                      value={formData.host}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="port" className="text-right text-xs">
                      端口
                    </Label>
                    <Input
                      id="port"
                      name="port"
                      value={formData.port}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="database" className="text-right text-xs">
                      数据库名
                    </Label>
                    <Input
                      id="database"
                      name="database"
                      value={formData.database}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right text-xs">
                      用户名
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right text-xs">
                      密码
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <Label className="text-right text-xs pt-2">
                      表名
                    </Label>
                    <div className="col-span-3 space-y-2">
                      {formData.tableNames.map((tableName, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={tableName}
                            onChange={(e) => handleTableNameChange(index, e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeTableName(index)}
                            disabled={formData.tableNames.length <= 1}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTableName}
                        className="mt-2 w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        添加表格
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Supabase settings */}
            {selectedType === 'supabase' && (
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium mb-3">Supabase 设置</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="apiEndpoint" className="text-right text-xs">
                      Supabase URL
                    </Label>
                    <Input
                      id="apiEndpoint"
                      name="apiEndpoint"
                      value={formData.apiEndpoint}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="https://yourproject.supabase.co"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="apiKey" className="text-right text-xs">
                      API 密钥
                    </Label>
                    <Input
                      id="apiKey"
                      name="apiKey"
                      type="password"
                      value={formData.apiKey}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="your-supabase-api-key"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <Label className="text-right text-xs pt-2">
                      表名
                    </Label>
                    <div className="col-span-3 space-y-2">
                      {formData.tableNames.map((tableName, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={tableName}
                            onChange={(e) => handleTableNameChange(index, e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeTableName(index)}
                            disabled={formData.tableNames.length <= 1}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTableName}
                        className="mt-2 w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        添加表格
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* REST API settings */}
            {selectedType === 'rest' && (
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium mb-3">API 设置</h3>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="apiEndpoint" className="text-right text-xs">
                    API 地址
                  </Label>
                  <Input
                    id="apiEndpoint"
                    name="apiEndpoint"
                    value={formData.apiEndpoint}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="https://api.example.com/events"
                  />
                </div>
              </div>
            )}
            
            {/* Connection test status */}
            {connectionStatus.tested && (
              <div className={`p-3 rounded-md ${connectionStatus.success ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'} text-sm flex items-center gap-2`}>
                {connectionStatus.success ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className={connectionStatus.success ? 'text-green-700' : 'text-red-700'}>
                  {connectionStatus.message}
                </span>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedType !== 'local' && (
              <Button 
                variant="outline" 
                onClick={testConnection} 
                disabled={isTesting}
                className="w-full sm:w-auto"
              >
                {isTesting ? (
                  <>
                    <span className="opacity-0">测试连接</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    <span>测试连接</span>
                  </>
                )}
              </Button>
            )}
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={() => setShowDialog(false)}
                className="flex-1"
              >
                取消
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="relative overflow-hidden flex-1"
              >
                {isSubmitting ? (
                  <>
                    <span className="opacity-0">确认</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    <span>连接</span>
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataSourceSelector;
