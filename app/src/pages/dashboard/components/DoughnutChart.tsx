import { formatAssetName } from '@libs/formatter';
import big, { Big } from 'big.js';
import { Tooltip, Chart } from 'chart.js';
import React, { Component, createRef } from 'react';

Tooltip.positioners.custom = function (elements, position) {
  if (!elements.length) {
    return false;
  }
  var offset = 0;
  return {
    x: position.x + 40,
    y: position.y + 40,
  };
};

export type DoughnutChartDescriptor = {
  label: string;
  color: string;
  value: number;
};

export interface DoughnutChartProps {
  descriptors: DoughnutChartDescriptor[];
}

export class DoughnutChart extends Component<DoughnutChartProps> {
  private canvasRef = createRef<HTMLCanvasElement>();
  private chart!: Chart;

  render() {
    return <canvas ref={this.canvasRef} />;
  }

  componentWillUnmount() {
    this.chart?.destroy();
  }

  shouldComponentUpdate(nextProps: Readonly<DoughnutChartProps>): boolean {
    return this.props.descriptors !== nextProps.descriptors;
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate(prevProps: Readonly<DoughnutChartProps>) {
    if (this.props.descriptors !== prevProps.descriptors) {
      const noValuePresent =
        this.props.descriptors.filter((d) => d.value !== 0).length === 0;

      if (noValuePresent) {
        this.chart.data.labels = this.props.descriptors.map((d) => d.asset);
        this.chart.data.datasets[0].data = [1];
        this.chart.data.datasets[0].backgroundColor = ['#c2c2c2'];
      } else {
        this.chart.data.datasets[0].data = this.props.descriptors.map((d) =>
          Number(big(d.value).div(1e8)),
        );
        this.chart.data.datasets[0].backgroundColor =
          this.props.descriptors.map((d) => d.color);
        // this.chart.data.datasets[0].spacing = 10;
        // this.chart.data.datasets[0].offset = 10;
        // this.chart.options.plugins?.tooltip
        this.chart.data.labels = this.props.descriptors.map((d) =>
          formatAssetName(d.label),
        );
      }
    }

    this.chart.update();
  }

  private createChart = () => {
    this.chart = new Chart(this.canvasRef.current!, {
      type: 'doughnut',
      options: {
        cutout: '80%',
        radius: '90%',
        interaction: { mode: 'index' },
        onHover: function (e) {
          const points = this.getElementsAtEventForMode(
            e,
            'index',
            { axis: 'x', intersect: true },
            false,
          );

          if (points.length) e.native.target.style.cursor = 'pointer';
          else e.native.target.style.cursor = 'default';
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            position: 'custom',
            callbacks: {
              label: function (context) {
                let label = context.label || '';

                if (label) {
                  label += ': ';
                }
                if (context.parsed !== null) {
                  label += new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(context.parsed);
                }
                return label;
              },
            },
          },
        },
      },
      data: {
        labels: this.props.descriptors.map((d) => d.label),
        datasets: [
          {
            data: this.props.descriptors.map((d) => d.value),
            backgroundColor: this.props.descriptors.map((d) => d.color),
            borderWidth: 0,
            hoverOffset: 10,
          },
        ],
      },
    });
  };
}
