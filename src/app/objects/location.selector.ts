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
}
