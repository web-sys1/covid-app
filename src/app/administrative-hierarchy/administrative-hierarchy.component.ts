import { Component, OnInit } from '@angular/core';
import { AdministrativeHierarchyService } from './administrative-hierarchy.service';
import { HierarchyNode } from './models/hierarchyNode.model';

@Component({
  selector: 'app-administrative-hierarchy',
  templateUrl: './administrative-hierarchy.component.html',
  styleUrls: ['./administrative-hierarchy.component.scss']
})
export class AdministrativeHierarchyComponent implements OnInit {
  public hierarchyNodes: HierarchyNode[];

  constructor(private administrativeHierarchyService: AdministrativeHierarchyService) {
    this.hierarchyNodes = this.administrativeHierarchyService.getHierarchyNodes();
   }

  ngOnInit(): void {
  }

}