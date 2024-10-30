import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { PieChartComponent } from '../../char/pie-chart';
import { AreaChartComponent } from '../../char/area-chart';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit{
  ngOnInit(): void {
    initFlowbite();
    new AreaChartComponent(); 
    new PieChartComponent();
  }
}
