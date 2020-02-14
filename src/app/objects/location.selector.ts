import { OnInit, Injectable } from '@angular/core';
import stateRaw from '../../assets/json/states.json';
import countryRaw from '../../assets/json/countries.json';

export interface Country {
    id: string;
    name: string;
}
export interface IJsonCountries {
    Countries: (Country)[];
}
export interface IJsonStates {
    States: State[];
}
export interface State {
    id: string;
    name: string;
}

@Injectable()
export class LocationSelector implements OnInit {
    constructor() {}

    ngOnInit() {
    }

    public getStates() {
        return stateRaw as IJsonStates;
    }

    public getCountries() {
        return countryRaw as IJsonCountries;
    }

    public getAllLocations() {
        const options: Array<any> = this.getCountries().Countries;
        options.push(this.getStates().States);
        return options.sort(this.compare);
    }

    public compare(a, b) {
        let comparison = 0;
        if (a.name > b.name) {
          comparison = 1;
        } else if (a.name < b.name) {
          comparison = -1;
        }
        return comparison;
      }
}
