import { Injectable } from "@angular/core";
import { FlatAdministrativeItem } from '../models/flatAdministrativeItem.model';
import { TopojsonService } from '../services/topojson.service';
import { HierarchyNode } from './models/hierarchyNode.model';


@Injectable()
export class AdministrativeHierarchyService {

    constructor(private topojsonService: TopojsonService) { }

    public getHierarchyNodes(): HierarchyNode[] {
        const flatItemsWithParents = this.topojsonService.getFlatItemsWithParents();
        const parentItems = flatItemsWithParents.filter((item, index, self) => self.findIndex(t => t.level1Code === item.level1Code) === index)
        const hierarchyNodes = parentItems.map(level1Item =>
            new HierarchyNode(
                level1Item.level1Name,
                level1Item.level1Code,
                this.getChildrenForNode(level1Item.level1Code, flatItemsWithParents))
        )
        const sortedNodes = hierarchyNodes.sort((a, b) => a.name.localeCompare(b.name));

        return sortedNodes;
    }

    private getChildrenForNode(parentTerytCode: string, flatItemsWithParents: FlatAdministrativeItem[]): HierarchyNode[] {
        const level1Children = flatItemsWithParents.filter(item => item.level1Code == parentTerytCode);
        const level1ChildrenNodes = level1Children.map(item => new HierarchyNode(item.level2Name, item.level2Code))
        const sortedLevel1Children = level1ChildrenNodes.sort((a, b) => a.name.localeCompare(b.name));

        return sortedLevel1Children;
    };
}