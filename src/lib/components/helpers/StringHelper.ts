export class StringHelper {    
    public static makeCapitalizedSpaced(str: string): string {
        return str.replace(/([A-Z, 0-9])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    }

    public static formatNumber(num: number, dp: number = 2): string {
        return num.toFixed(dp).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
}