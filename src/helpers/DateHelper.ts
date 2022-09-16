/**
 * Wrapper to abstract date library from validator source.
 * Moving to luxon
 */
import { DateTime } from "luxon";
export class DateHelper {
    public static isSameOrAfter(greaterThan:Date, lessThan:Date) : boolean {
        return DateTime.fromJSDate(greaterThan) >= DateTime.fromJSDate(lessThan);
    }
    public static isSameOrBefore(lessThan:Date, greaterThan:Date) : boolean {
        return DateTime.fromJSDate(lessThan) <= DateTime.fromJSDate(greaterThan);
    }
    public static isSame(lessThan:Date, greaterThan:Date) : boolean {
        return DateTime.fromJSDate(lessThan) === DateTime.fromJSDate(greaterThan);
    }
    public static isDateString(input:string) : boolean {
        if(typeof(input) !== "string" ) return false;
        return DateTime.fromISO(input).isValid;
    }
    public static isDateObject(input:object) : boolean {
        if (Object.prototype.toString.call(input) === "[object Date]")
            return true;
        return false;
    }
    
    public static parseISODate(dateString:string) : Date {
        return DateTime.fromISO(dateString).toJSDate();
    }
    public static addSeconds(date:Date, seconds:number) : Date {
        return DateTime.fromJSDate(date).plus({seconds: seconds}).toJSDate();
    }
    public static addMinutes(date:Date, minutes:number) : Date {
        return DateTime.fromJSDate(date).plus({minutes: minutes}).toJSDate();
    }
    public static addHours(date:Date, hours:number) : Date {
        return DateTime.fromJSDate(date).plus({hours: hours}).toJSDate();
    }
    public static subtractSeconds(date:Date, seconds:number) : Date {
        return DateTime.fromJSDate(date).minus({seconds: seconds}).toJSDate();
    }
    public static subtractMinutes(date:Date, minutes:number) : Date {
        return DateTime.fromJSDate(date).minus({minutes: minutes}).toJSDate();
    }
    public static subtractHours(date:Date, hours:number) : Date {
        return DateTime.fromJSDate(date).minus({hours: hours}).toJSDate();
    }
}