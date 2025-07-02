import {
  Component,
  Input,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
})
export class ChartComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() chartType: ChartType = 'doughnut';
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() datasetLabel: string = 'Datos';

  chart!: Chart;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].isFirstChange()) {
      this.updateChart();
    }
  }

  private createChart() {
    const config: ChartConfiguration = {
      type: this.chartType,
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.datasetLabel,
            data: this.data,
            backgroundColor: ['#28a745', '#dc3545'], // verde para completados, rojo para pendientes
            borderColor: ['#1e7e34', '#bd2130'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    };

    this.chart = new Chart(this.canvasRef.nativeElement, config);
  }

  private updateChart() {
    if (this.chart) {
      this.chart.data.datasets[0].data = this.data;
      this.chart.update();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
