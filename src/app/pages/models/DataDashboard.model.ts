export interface DataDashboard {
    runningTimeTotal: number;
    maintenanceDueDate: string;
    pushPulseCount: number;
    backtrackingCount: number;
    reversalCount: number;
    alarmCount: number;
    brakingLifetimeRemain: number;
    brakingTimeTotal: number;
    brakingReplacementCount: number;
    current: number;
    overcurrent: boolean;
    overvoltage: boolean;
    inverterOverloadError: boolean;
  }
  