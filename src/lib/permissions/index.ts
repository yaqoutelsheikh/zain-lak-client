export type Permission = string;
export type PermissionSet = ReadonlySet<Permission>;

const all = "*";

export function toSet ( list: Permission[] ): PermissionSet {

    return new Set(list);

}
export function can ( set: PermissionSet, perm: Permission ): boolean {

    if ( set.has(all) ) return true;
    if ( set.has(perm) ) return true;

    const dot = perm.lastIndexOf(".");

    return dot > 0 && set.has(`${perm.slice(0, dot)}.${all}`);

}
export function canAll ( set: PermissionSet, perms: Permission[] ): boolean {

    return perms.every((perm) => can(set, perm));

}
export function canAny ( set: PermissionSet, perms: Permission[] ): boolean {

    return perms.some((perm) => can(set, perm));

}
