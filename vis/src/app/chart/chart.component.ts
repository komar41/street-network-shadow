import { Component, AfterViewInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { Data } from '../data.model';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements AfterViewInit {
  boxPlot: any;
  scale_x: any;
  scale_y: any;

  seasons = new Map<string, string>([
    ['chi-dec-21', 'Winter'],
    ['chi-sep-22', 'Fall'],
    ['chi-jun-21', 'Summer'],
  ]);
  @Input() values: any;
  data: any;
  private dataSubscription: Subscription = new Subscription();

  constructor(public dataService: DataService) {}

  ngAfterViewInit(): void {
    //
    this.dataSubscription = this.dataService
      .getDataUpdate()
      .subscribe((newData: object) => {
        this.data = this.reformat_data(newData);
        this.updateChart();
      });

    var margin = { top: 10, right: 30, bottom: 30, left: 40 };
    let width = 420 - margin.left - margin.right;
    let height = 200 - margin.top - margin.bottom;

    this.boxPlot = d3
      .selectAll('#chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .style('width', '100%')
      .style('height', '100%');

    this.scale_x = d3
      .scaleBand()
      .range([0, width])
      .domain(['Winter', 'Summer', 'Fall'])
      .paddingInner(1)
      .paddingOuter(0.5);
    this.boxPlot
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(this.scale_x));

    this.scale_y = d3.scaleLinear().domain([0, 800]).range([height, 0]);
    this.boxPlot.append('g').call(d3.axisLeft(this.scale_y));

    var season_name = ['Winter', 'Summer', 'Fall'];
    var stats = [
      {
        IQR: 0,
        max: 0,
        median: 0,
        min: 0,
        q1: 0,
        q3: 0,
      },
      {
        IQR: 0,
        max: 0,
        median: 0,
        min: 0,
        q1: 0,
        q3: 0,
      },
      {
        IQR: 0,
        max: 0,
        median: 0,
        min: 0,
        q1: 0,
        q3: 0,
      },
    ];

    var map = new Map();
    for (var i = 0; i < season_name.length; i++) {
      map.set(season_name[i], stats[i]);
    }

    this.boxPlot
      .selectAll('vertLines')
      .data(map)
      .enter()
      .append('line')
      .attr('x1', (d: any, idx: number) => {
        return this.scale_x(d[0]);
      })
      .attr('x2', (d: any) => {
        return this.scale_x(d[0]);
      })
      .attr('y1', (d: any) => {
        console.log(this.scale_y(d[1].min));
        return this.scale_y(d[1].min);
      })
      .attr('y2', (d: any) => {
        return this.scale_y(d[1].max);
      })
      .attr('class', 'lines')
      .attr('stroke', 'black')
      .style('width', 40)
      .style('stroke-width', '1.5');

    var boxWidth = 80;
    this.boxPlot
      .selectAll('boxes')
      .data(map)
      .enter()
      .append('rect')
      .attr('x', (d: any) => {
        return this.scale_x(d[0])! - boxWidth / 2;
      })
      .attr('y', (d: any) => {
        return this.scale_y(d[1].q3);
      })
      .attr('height', (d: any) => {
        return this.scale_y(d[1].q1) - this.scale_y(d[1].q3);
      })
      .attr('width', boxWidth)
      .attr('stroke', 'black')
      .attr('class', 'boxes')
      .style('fill', (d: any, idx: number) => {
        if (idx == 0)
          return '#FFFF00';
        if (idx == 1)
          return '#CC0066';
        else
          return '#0066CC';
      })
      .style('stroke-width', '1.5');

    this.boxPlot
      .selectAll('medianLines')
      .data(map)
      .enter()
      .append('line')
      .attr('x1', (d: any) => {
        return this.scale_x(d[0])! - boxWidth / 2;
      })
      .attr('x2', (d: any) => {
        return this.scale_x(d[0])! + boxWidth / 2;
      })
      .attr('y1', (d: any) => {
        return this.scale_y(d[1].median);
      })
      .attr('y2', (d: any) => {
        return this.scale_y(d[1].median);
      })
      .attr('class', 'medianLines')
      .attr('stroke', 'black')
      .style('width', 80)
      .style('stroke-width', '1.5');
  }

  private reformat_data(newData: object): Data[] {
    let data = [];
    for (const [key, value] of Object.entries(newData)) {
      let q1 = value['25%'];
      let q3 = value['75%'];
      let season_name = this.seasons.get(key);
      let median = value['50%'];
      let min = value.min;
      let max = value.max;

      const season: Data = {
        season: String(season_name),
        q1: q1,
        median: median,
        q3: q3,
        min: min,
        max: max,
      };
      data.push(season);
    }
    return data;
  }

  updateChart() {
    let val = [
      ['Winter', this.data[2]],
      ['Summer', this.data[1]],
      ['Fall', this.data[0]],
    ];

    this.boxPlot
      .selectAll('.lines')
      .data(val)
      .attr('y1', (d: any) => {
        return this.scale_y(d[1].min);
      })
      .attr('y2', (d: any) => {
        return this.scale_y(d[1].max);
      });

    this.boxPlot
      .selectAll('.boxes')
      .data(val)
      .attr('y', (d: any) => {
        return this.scale_y(d[1].q3);
      })
      .attr('height', (d: any) => {
        return this.scale_y(d[1].q1) - this.scale_y(d[1].q3);
      });

    this.boxPlot
      .selectAll('.medianLines')
      .data(val)
      .attr('y1', (d: any) => {
        return this.scale_y(d[1].median);
      })
      .attr('y2', (d: any) => {
        return this.scale_y(d[1].median);
      })
  }

  updateValues(values: any) {
    //
  }
}
