import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Chart as ChartJS, ChartConfiguration, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { DataDashboard } from 'src/app/pages/models/DataDashboard.model';

// 🟢 Đăng ký tất cả các thành phần cần thiết (Quan trọng)
ChartJS.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  hoistLoadingLabels: string[] = ['Light Load', 'Medium Load', 'Heavy Load'];
  hoistLoadingData: number[] = [660, 370, 103];
  hoistLoadingColors: string[] = ['#2ecc71', '#2980b9', '#e67e22'];
  hoistLoadingChart!: ChartJS<'pie', number[], string>;

  craneOperationLabels: string[] = ['No Load', 'Load', 'Overload'];
  craneOperationData: number[] = [1200, 560, 100];
  craneOperationColors: string[] = ['#2ecc71', '#2980b9', '#e74c3c'];
  craneOperationChart!: ChartJS<'pie', number[], string>;

  // 🟢 Khai báo biến mới từ yêu cầu của bạn
  statusOnValue: number = 1860;
  antiSwayValue: string = "ON";
  brakingOnValue: number = 699;
  totalOnTime: number = 1860;
  hoistTime: number = 55;
  trolleyTime: number = 127;
  longTravelTime: number = 57;
  hoistOverload: number = 60;
  trolleyOverload: number = 15;
  longTravelOverload: number = 25;
  hoistPulse: number = 355;
  trolleyPulse: number = 151;
  longTravelPulse: number = 122;

  dataDashboard: DataDashboard = {
    runningTimeTotal: 0,
    maintenanceDueDate: '',
    pushPulseCount: 0,
    backtrackingCount: 0,
    reversalCount: 0,
    alarmCount: 0,
    brakingLifetimeRemain: 0,
    brakingTimeTotal: 0,
    brakingReplacementCount: 0,
    current: 0,
    overcurrent: false,
    overvoltage: false,
    inverterOverloadError: false
  };

  private webSocket: WebSocket | null = null;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.hoistLoadingChart = this.createPieChart('hoistLoadingChart', this.hoistLoadingLabels, this.hoistLoadingData, this.hoistLoadingColors);
    this.craneOperationChart = this.createPieChart('craneOperationChart', this.craneOperationLabels, this.craneOperationData, this.craneOperationColors);

    // 🟢 Giả lập cập nhật dữ liệu từ WebSocket sau 5 giây
    // setTimeout(() => {
    //   console.log("Updating chart data...");
    //   this.updateChartData(this.hoistLoadingChart, [500, 250, 150]);
    //   this.updateChartData(this.craneOperationChart, [800, 400, 300]);
    // }, 1000);

    const token = this.getToken();
    if (token) {
      console.log('Token retrieved: ', token);
      this.initWebSocket(token);
    } else {
      console.log('No token found');
    }
  }

  getToken(): string | null {
    return window.localStorage.getItem('auth-token');
  }

  initWebSocket(token: string): void {
    const entityId = "a6f3a720-ef76-11ef-8e00-e370a74757c3";
    this.webSocket = new WebSocket("wss://demo.thingsboard.io/api/ws");

    this.webSocket.onopen = () => {
      const authMessage = {
        authCmd: {
          cmdId: 0,
          token: token
        },
        cmds: [
          {
            entityType: "DEVICE",
            entityId: entityId,
            scope: "LATEST_TELEMETRY",
            cmdId: 10,
            type: "TIMESERIES"
          }
        ]
      };
      this.webSocket?.send(JSON.stringify(authMessage));
      console.log("WebSocket connection established, message sent: ", authMessage);
    };

    this.webSocket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      this.processWebSocketData(event.data);
    };

    this.webSocket.onclose = () => {
      console.warn("WebSocket connection closed.");
    };
  }

  processWebSocketData(data: string): void {
    try {
      const parsedData = JSON.parse(data);
      console.log("Parsed WebSocket Data:", parsedData);
  
      if (parsedData.data) {
        const telemetryData = parsedData.data;
  
        // 🔹 Cập nhật tất cả các giá trị trong dataDashboard
        Object.keys(telemetryData).forEach((key) => {
          const dataPoint = telemetryData[key];
  
          if (Array.isArray(dataPoint) && dataPoint.length > 0) {
            const firstEntry = dataPoint[0]; // Lấy phần tử đầu tiên trong mảng
            
            if (typeof firstEntry === 'object' && "1" in firstEntry) {
              (this.dataDashboard as any)[key] = Number(firstEntry["1"]); // Chuyển đổi thành số nếu cần
            }
          }
        });
  
        // 🔹 Cập nhật các giá trị khác (ngoài dataDashboard)
        this.statusOnValue = telemetryData.statusOnValue?.[0]?.["1"] ? Number(telemetryData.statusOnValue[0]["1"]) : this.statusOnValue;
        this.antiSwayValue = telemetryData.antiSwayValue?.[0]?.["1"] || this.antiSwayValue;
        this.brakingOnValue = telemetryData.backtrackingCount?.[0]?.["1"] ? Number(telemetryData.backtrackingCount[0]["1"]) : this.dataDashboard.backtrackingCount;
        this.totalOnTime = telemetryData.totalOnTime?.[0]?.["1"] ? Number(telemetryData.totalOnTime[0]["1"]) : this.totalOnTime;
        this.hoistTime = telemetryData.hoistTime?.[0]?.["1"] ? Number(telemetryData.hoistTime[0]["1"]) : this.hoistTime;
        this.trolleyTime = telemetryData.trolleyTime?.[0]?.["1"] ? Number(telemetryData.trolleyTime[0]["1"]) : this.trolleyTime;
        this.longTravelTime = telemetryData.longTravelTime?.[0]?.["1"] ? Number(telemetryData.longTravelTime[0]["1"]) : this.longTravelTime;
        this.hoistOverload = telemetryData.hoistOverload?.[0]?.["1"] ? Number(telemetryData.hoistOverload[0]["1"]) : this.hoistOverload;
        this.trolleyOverload = telemetryData.trolleyOverload?.[0]?.["1"] ? Number(telemetryData.trolleyOverload[0]["1"]) : this.trolleyOverload;
        this.longTravelOverload = telemetryData.longTravelOverload?.[0]?.["1"] ? Number(telemetryData.longTravelOverload[0]["1"]) : this.longTravelOverload;
        this.hoistPulse = telemetryData.hoistPulse?.[0]?.["1"] ? Number(telemetryData.hoistPulse[0]["1"]) : this.hoistPulse;
        this.trolleyPulse = telemetryData.trolleyPulse?.[0]?.["1"] ? Number(telemetryData.trolleyPulse[0]["1"]) : this.trolleyPulse;
        this.longTravelPulse = telemetryData.longTravelPulse?.[0]?.["1"] ? Number(telemetryData.longTravelPulse[0]["1"]) : this.longTravelPulse;
  
        //Test update biểu đồ
        this.craneOperationData = [telemetryData.craneOperationData1?.[0]?.["1"] ? Number(telemetryData.craneOperationData1[0]["1"]): 1200,
        telemetryData.craneOperationData2?.[0]?.["1"] ? Number(telemetryData.craneOperationData2[0]["1"]): 560, 
        telemetryData.craneOperationData3?.[0]?.["1"] ? Number(telemetryData.craneOperationData3[0]["1"]): 100];
        console.log("Updating chart data...");
        this.updateChartData(this.craneOperationChart, this.craneOperationData);

        console.log("Updated DataDashboard:", this.dataDashboard);
        console.log("Updated Other Variables:", {
          statusOnValue: this.statusOnValue,
          antiSwayValue: this.antiSwayValue,
          brakingOnValue: this.brakingOnValue,
          totalOnTime: this.totalOnTime,
          hoistTime: this.hoistTime,
          trolleyTime: this.trolleyTime,
          longTravelTime: this.longTravelTime,
          hoistOverload: this.hoistOverload,
          trolleyOverload: this.trolleyOverload,
          longTravelOverload: this.longTravelOverload,
          hoistPulse: this.hoistPulse,
          trolleyPulse: this.trolleyPulse,
          longTravelPulse: this.longTravelPulse,
        });
  
        // 🔹 Đảm bảo UI cập nhật nếu không thay đổi ngay lập tức
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error("Error processing WebSocket data:", error);
    }
  }
  

  createPieChart(chartId: string, labels: string[], data: number[], colors: string[]): ChartJS<'pie', number[], string> | null {
    const canvas = document.getElementById(chartId) as HTMLCanvasElement | null;
    
    if (!canvas) {
      console.error(`Canvas với ID '${chartId}' không tìm thấy.`);
      return null;
    }
  
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error(`Không thể lấy context 2D cho canvas '${chartId}'.`);
      return null;
    }
  
    return new ChartJS(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: false,
              boxWidth: 20,
              boxHeight: 20,
              padding: 10,
              font: { size: 14, weight: 'bold' },
              color: '#fff'
            }
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem: any) {
                let total = tooltipItem.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
                let value = tooltipItem.raw;
                let percentage = ((value / total) * 100).toFixed(1) + '%';
                return `${value} (${percentage})`;
              }
            }
          },
          datalabels: {
            color: '#fff',
            font: { 
              weight: 'bold',
              size: 18
            },
            formatter: (value: number, ctx: any) => {
              let total = ctx.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
              let percentage = ((value / total) * 100).toFixed(1) + '%';
              return `${value} (${percentage})`;
            }
          }
        }
      }
    });
  }
  

  updateChartData(chart: ChartJS<'pie', number[], string>, newData: number[]): void {
    if (chart) {
      chart.data.datasets[0].data = newData;
      chart.update();
    }
  }
  
}
