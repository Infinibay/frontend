import { createDebugger } from './debug.js';

const debug = createDebugger('frontend:utils:performance');

class PerformanceMonitor {
  constructor() {
    this.timers = new Map();
    this.metrics = new Map();
    this.thresholds = {
      init: 2000,           // 2 seconds for app initialization
      dataLoad: 1000,       // 1 second for data loading
      realTime: 100,        // 100ms for real-time event processing
      pageRender: 500,      // 500ms for page rendering
    };
  }

  startTimer(label) {
    const timestamp = performance.now();
    this.timers.set(label, timestamp);
    debug.info(`Timer started: ${label}`);
    return timestamp;
  }

  endTimer(label) {
    const endTime = performance.now();
    const startTime = this.timers.get(label);

    if (!startTime) {
      debug.warn(`Timer '${label}' was not started`);
      return null;
    }

    const duration = endTime - startTime;
    this.timers.delete(label);

    this.recordMetric(label, duration);
    debug.info(`Timer ended: ${label} - ${duration.toFixed(2)}ms`);

    return duration;
  }

  async measureAsync(label, asyncFn) {
    const startTime = this.startTimer(label);

    try {
      const result = await asyncFn();
      this.endTimer(label);
      return result;
    } catch (error) {
      this.endTimer(label);
      debug.error(`Async operation '${label}' failed:`, error);
      throw error;
    }
  }

  recordMetric(label, value, type = 'duration') {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, {
        type,
        values: [],
        count: 0,
        total: 0,
        average: 0,
        min: Infinity,
        max: -Infinity,
      });
    }

    const metric = this.metrics.get(label);
    metric.values.push(value);
    metric.count += 1;
    metric.total += value;
    metric.average = metric.total / metric.count;
    metric.min = Math.min(metric.min, value);
    metric.max = Math.max(metric.max, value);

    // Keep only last 100 values to prevent memory issues
    if (metric.values.length > 100) {
      metric.values.shift();
    }

    this.checkThreshold(label, value);
  }

  checkThreshold(label, value) {
    const threshold = this.thresholds[label] || this.thresholds.dataLoad;

    if (value > threshold) {
      debug.warn(`Performance threshold exceeded for '${label}': ${value.toFixed(2)}ms > ${threshold}ms`);
    }
  }

  trackDataLoading(service, startTime, endTime, success = true) {
    const duration = endTime - startTime;
    const label = `dataLoad:${service}`;

    this.recordMetric(label, duration);
    this.recordMetric('dataLoad:total', duration);

    if (!success) {
      this.recordMetric(`dataLoad:${service}:errors`, 1, 'count');
    }

    debug.info(`Data loading tracked: ${service} - ${duration.toFixed(2)}ms - ${success ? 'success' : 'error'}`);
  }

  trackRealTimeEvent(eventType, processingTime) {
    const label = `realTime:${eventType}`;

    this.recordMetric(label, processingTime);
    this.recordMetric('realTime:total', processingTime);

    debug.info(`Real-time event tracked: ${eventType} - ${processingTime.toFixed(2)}ms`);
  }

  getMetrics(label = null) {
    if (label) {
      return this.metrics.get(label) || null;
    }

    const result = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });

    return result;
  }

  getPerformanceReport() {
    const metrics = this.getMetrics();
    const report = {
      summary: {
        totalMetrics: Object.keys(metrics).length,
        dataLoadingAverage: metrics['dataLoad:total']?.average || 0,
        realTimeAverage: metrics['realTime:total']?.average || 0,
        timestamp: new Date().toISOString(),
      },
      details: metrics,
    };

    debug.info('Performance report generated:', report.summary);
    return report;
  }

  resetMetrics() {
    this.metrics.clear();
    this.timers.clear();
    debug.info('Performance metrics reset');
  }

  setThreshold(label, value) {
    this.thresholds[label] = value;
    debug.info(`Threshold set: ${label} = ${value}ms`);
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Export convenience functions
export const startTimer = (label) => performanceMonitor.startTimer(label);
export const endTimer = (label) => performanceMonitor.endTimer(label);
export const measureAsync = (label, asyncFn) => performanceMonitor.measureAsync(label, asyncFn);
export const trackDataLoading = (service, startTime, endTime, success) =>
  performanceMonitor.trackDataLoading(service, startTime, endTime, success);
export const trackRealTimeEvent = (eventType, processingTime) =>
  performanceMonitor.trackRealTimeEvent(eventType, processingTime);
export const getMetrics = (label) => performanceMonitor.getMetrics(label);
export const getPerformanceReport = () => performanceMonitor.getPerformanceReport();
export const resetMetrics = () => performanceMonitor.resetMetrics();
export const setThreshold = (label, value) => performanceMonitor.setThreshold(label, value);

export default performanceMonitor;