import { Inote } from "./inote";

export interface Itask {
    id: number;
    name: string;
    description: string;
    date_of_start: Date;
    date_of_end: Date;
    status: string;
    task_type: string;
    // Used capital 'N' instead of small 'n' on notes coz of the backend returned named object
    Notes: Inote[];   // ? - means this is an optional field
}
