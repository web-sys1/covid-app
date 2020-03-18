import { Injectable } from "@angular/core";
import { FlatAdministrativeItem } from '../models/flatAdministrativeItem.model';
import _topoFeatures from '../_administrative-data/topoFeatures.json';


@Injectable()
export class TopojsonService {

    private readonly level1ItemNameKey = "WOJ_NAME";
    private readonly level1ItemCodeKey = "WOJ_TERYT";
    private readonly level2ItemNameKey = "POW_NAME";
    private readonly level2ItemCodeKey = "POW_TERYT";

    private topojsonObject = _topoFeatures;

    constructor() { }

    public getFlatItemsWithParents(): FlatAdministrativeItem[] {
        const geojson = topojson.feature(
            this.topojsonObject,
            this.getTopologyLayer(this.topojsonObject)
        );
        const allItemsWitParents = this.getAllItems(geojson.features);

        return allItemsWitParents;
    }

    private getAllItems(allFeatures): FlatAdministrativeItem[] {
        const flatAdministrativeItems = allFeatures.map(item =>
            new FlatAdministrativeItem(
                item.properties[this.level1ItemNameKey],
                item.properties[this.level1ItemCodeKey],
                item.properties[this.level2ItemNameKey],
                item.properties[this.level2ItemCodeKey]
            ));

        return flatAdministrativeItems;
    }

    private getTopologyLayer(topology: any) {
        return topology.objects[Object.keys(topology.objects)[0]];
    }
}