export class CountryCovidData {
    country: string;
    active: number;
    cases: number;
    casesPerOneMillion: number;
    critical: number;
    deaths: number;
    recovered: number;
    todayCases: number;
    todayDeaths: number;
    countryInfo: CountryInfo;
}

export class CountryInfo {
    _id: number;
    flag: string;
    iso2: string;
    iso3: string;
    lat: number
    long: number;
}