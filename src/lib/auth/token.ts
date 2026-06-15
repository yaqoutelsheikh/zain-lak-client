let value: string | null = null;

export function set ( token: string ) {

    value = token;

}
export function get () {

    return value;

}
export function clear () {

    value = null;

}
