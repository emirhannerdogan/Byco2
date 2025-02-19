// Define the IDistrict interface
export interface IDistrict {
    value: number;
    text: string;
}

// Define the ICity interface
export interface ICity {
    value: number;
    text: string;
    districts: IDistrict[];
}