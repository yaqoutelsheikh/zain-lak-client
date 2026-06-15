"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKey, request } from "@/api/client";
import { api } from "@/api/registry";
import { can, canAll, canAny, type Permission, type PermissionSet, toSet } from "@/lib/permissions";

const empty: PermissionSet = new Set();

export function usePermission () {

    const { data, isPending } = useQuery({
        queryKey: queryKey(api.permissions),
        queryFn: ({ signal }) => request(api.permissions, { signal }),
        staleTime: 5 * 60 * 1000,
        enabled: false,
    });

    const permissions = data ? toSet(data.data) : empty;

    return {
        isPending,
        permissions,
        can: ( perm: Permission ) => can(permissions, perm),
        canAll: ( perms: Permission[] ) => canAll(permissions, perms),
        canAny: ( perms: Permission[] ) => canAny(permissions, perms),
    };

}
