export function isColorString(str: string) {
    return str.length === 7 && str.charAt(0) === '#';
}