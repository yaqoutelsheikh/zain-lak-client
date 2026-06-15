export function isEmail ( value: string ) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

}
export function isStrongPassword ( value: string ) {

    return value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value);

}
