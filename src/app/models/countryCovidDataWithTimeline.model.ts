export class CountryCovidDataWithTimeline {
    country: string;
    province: string;
    timeline: TimelineCovidData[]
}

export class TimelineCovidData {
    date: Date;
    cases: number;
    deaths: number;
    recovered: number;
}