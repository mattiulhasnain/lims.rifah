import React from 'react';

// Performance monitoring utilities for LIMS system

export interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface PerformanceReport {
  metrics: PerformanceMetric[];
  summary: {
    totalOperations: number;
    averageDuration: number;
    slowestOperation: PerformanceMetric | null;
    fastestOperation: PerformanceMetric | null;
  };
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private activeMetrics: Map<string, PerformanceMetric> = new Map();

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Start timing an operation
  startTimer(name: string, metadata?: Record<string, any>): string {
    const id = `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata
    };
    
    this.activeMetrics.set(id, metric);
    return id;
  }

  // End timing an operation
  endTimer(id: string): PerformanceMetric | null {
    const metric = this.activeMetrics.get(id);
    if (!metric) return null;

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    this.metrics.push(metric);
    this.activeMetrics.delete(id);

    // Log slow operations
    if (metric.duration > 1000) { // 1 second threshold
      console.warn(`Slow operation detected: ${metric.name} took ${metric.duration.toFixed(2)}ms`);
    }

    return metric;
  }

  // Measure a function execution
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const id = this.startTimer(name, metadata);
    try {
      const result = await fn();
      this.endTimer(id);
      return result;
    } catch (error) {
      this.endTimer(id);
      throw error;
    }
  }

  // Measure a synchronous function execution
  measureSync<T>(
    name: string,
    fn: () => T,
    metadata?: Record<string, any>
  ): T {
    const id = this.startTimer(name, metadata);
    try {
      const result = fn();
      this.endTimer(id);
      return result;
    } catch (error) {
      this.endTimer(id);
      throw error;
    }
  }

  // Get performance report
  getReport(): PerformanceReport {
    const completedMetrics = this.metrics.filter(m => m.duration !== undefined);
    
    if (completedMetrics.length === 0) {
      return {
        metrics: [],
        summary: {
          totalOperations: 0,
          averageDuration: 0,
          slowestOperation: null,
          fastestOperation: null
        }
      };
    }

    const totalDuration = completedMetrics.reduce((sum, m) => sum + (m.duration || 0), 0);
    const averageDuration = totalDuration / completedMetrics.length;
    
    const slowestOperation = completedMetrics.reduce((slowest, current) => 
      (current.duration || 0) > (slowest.duration || 0) ? current : slowest
    );
    
    const fastestOperation = completedMetrics.reduce((fastest, current) => 
      (current.duration || 0) < (fastest.duration || 0) ? current : fastest
    );

    return {
      metrics: [...completedMetrics],
      summary: {
        totalOperations: completedMetrics.length,
        averageDuration,
        slowestOperation,
        fastestOperation
      }
    };
  }

  // Clear metrics
  clear(): void {
    this.metrics = [];
    this.activeMetrics.clear();
  }

  // Get metrics by name
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.name === name);
  }

  // Get slow operations (above threshold)
  getSlowOperations(thresholdMs: number = 1000): PerformanceMetric[] {
    return this.metrics.filter(m => (m.duration || 0) > thresholdMs);
  }
}

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();

  const measureAsync = <T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ) => monitor.measureAsync(name, fn, metadata);

  const measureSync = <T>(
    name: string,
    fn: () => T,
    metadata?: Record<string, any>
  ) => monitor.measureSync(name, fn, metadata);

  const startTimer = (name: string, metadata?: Record<string, any>) => 
    monitor.startTimer(name, metadata);

  const endTimer = (id: string) => monitor.endTimer(id);

  const getReport = () => monitor.getReport();

  return {
    measureAsync,
    measureSync,
    startTimer,
    endTimer,
    getReport
  };
};

// Note: Higher-order component removed due to TypeScript complexity
// Use the usePerformanceMonitor hook instead for React components

// Performance decorator for class methods
export const measurePerformance = (name?: string) => {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const metricName = name || `${target.constructor.name}.${propertyName}`;

    descriptor.value = async function (...args: any[]) {
      const monitor = PerformanceMonitor.getInstance();
      return monitor.measureAsync(metricName, () => method.apply(this, args));
    };
  };
};

// Export the singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance(); 