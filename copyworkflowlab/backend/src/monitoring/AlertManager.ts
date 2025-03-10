export interface Alert {
  type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  details: Record<string, any>;
  timestamp?: string;
}

export interface AlertChannel {
  name: string;
  type: 'email' | 'slack' | 'webhook' | 'console';
  config: Record<string, any>;
}

export class AlertManager {
  private alertChannels: AlertChannel[] = [];
  private alertHistory: Alert[] = [];
  private alertRules: Record<string, AlertRule> = {};

  constructor() {
    // Add default console channel
    this.addAlertChannel({
      name: 'console',
      type: 'console',
      config: {}
    });
  }

  public addAlertChannel(channel: AlertChannel): void {
    this.alertChannels.push(channel);
  }

  public removeAlertChannel(channelName: string): boolean {
    const initialLength = this.alertChannels.length;
    this.alertChannels = this.alertChannels.filter(channel => channel.name !== channelName);
    return this.alertChannels.length !== initialLength;
  }

  public addAlertRule(rule: AlertRule): void {
    this.alertRules[rule.id] = rule;
  }

  public removeAlertRule(ruleId: string): boolean {
    if (this.alertRules[ruleId]) {
      delete this.alertRules[ruleId];
      return true;
    }
    return false;
  }

  public sendAlert(alert: Alert): void {
    // Add timestamp if not provided
    if (!alert.timestamp) {
      alert.timestamp = new Date().toISOString();
    }
    
    // Store in history
    this.alertHistory.push(alert);
    
    // Send to all channels
    for (const channel of this.alertChannels) {
      this.sendAlertToChannel(alert, channel);
    }
  }

  private sendAlertToChannel(alert: Alert, channel: AlertChannel): void {
    // In a real implementation, this would send to different channels
    // For now, we'll just log to console
    switch (channel.type) {
      case 'console':
        console.log(`[ALERT][${alert.severity.toUpperCase()}] ${alert.message}`, alert.details);
        break;
        
      case 'email':
        console.log(`Would send email alert to ${channel.config.recipients}:`, alert);
        break;
        
      case 'slack':
        console.log(`Would send Slack alert to ${channel.config.channel}:`, alert);
        break;
        
      case 'webhook':
        console.log(`Would send webhook alert to ${channel.config.url}:`, alert);
        break;
    }
  }

  public evaluateAlertRules(context: Record<string, any>): void {
    for (const ruleId in this.alertRules) {
      const rule = this.alertRules[ruleId];
      
      try {
        if (this.evaluateRule(rule, context)) {
          this.sendAlert({
            type: rule.alertType,
            severity: rule.severity,
            message: rule.message,
            details: {
              ruleId: rule.id,
              context
            }
          });
        }
      } catch (error) {
        console.error(`Error evaluating alert rule ${ruleId}:`, error);
      }
    }
  }

  private evaluateRule(rule: AlertRule, context: Record<string, any>): boolean {
    // In a real implementation, this would evaluate the condition
    // For now, we'll use a simple approach
    
    // Example: Check if a property exceeds a threshold
    if (rule.condition.type === 'threshold') {
      const value = context[rule.condition.property];
      const threshold = rule.condition.threshold;
      
      switch (rule.condition.operator) {
        case '>':
          return value > threshold;
        case '>=':
          return value >= threshold;
        case '<':
          return value < threshold;
        case '<=':
          return value <= threshold;
        case '==':
          return value == threshold;
        case '!=':
          return value != threshold;
      }
    }
    
    // Example: Check for a specific status
    if (rule.condition.type === 'status') {
      return context.status === rule.condition.status;
    }
    
    return false;
  }

  public getAlertHistory(): Alert[] {
    return [...this.alertHistory];
  }

  public clearAlertHistory(): void {
    this.alertHistory = [];
  }
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  condition: AlertCondition;
  alertType: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
}

export type AlertCondition = ThresholdCondition | StatusCondition;

export interface ThresholdCondition {
  type: 'threshold';
  property: string;
  operator: '>' | '>=' | '<' | '<=' | '==' | '!=';
  threshold: number;
}

export interface StatusCondition {
  type: 'status';
  status: string;
} 