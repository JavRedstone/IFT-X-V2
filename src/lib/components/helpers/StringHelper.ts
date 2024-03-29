export class StringHelper {
    public static makeCapitalizedSpaced(str: string): string {
        return str.replace(/([A-Z, 0-9])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    }
}