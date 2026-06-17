"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, queryKey, request } from "@/api";
import type { AccountProfile } from "@/api/account";

export type AccountProfileInput = Pick<AccountProfile, "name" | "phone"> & {
    avatarUrl?: string | null;
};

export function useAccountOverview() {
    return useQuery({
        queryKey: queryKey(api.account.overview),
        queryFn: ({ signal }) => request(api.account.overview, { signal }),
        select: (result) => result.data,
    });
}

export function useAccountProfile() {
    return useQuery({
        queryKey: queryKey(api.account.profile),
        queryFn: ({ signal }) => request(api.account.profile, { signal }),
        select: (result) => result.data,
    });
}

export function useAccountOrders() {
    return useQuery({
        queryKey: queryKey(api.account.orders),
        queryFn: ({ signal }) => request(api.account.orders, { signal }),
        select: (result) => result.data,
    });
}

export function useAccountOrder(id: string | number | null) {
    return useQuery({
        queryKey: queryKey(api.account.order, { params: { id: id ?? "" } }),
        queryFn: ({ signal }) => request(api.account.order, { params: { id: id ?? "" }, signal }),
        select: (result) => result.data,
        enabled: id !== null,
    });
}

export function useAccountBookings() {
    return useQuery({
        queryKey: queryKey(api.account.bookings),
        queryFn: ({ signal }) => request(api.account.bookings, { signal }),
        select: (result) => result.data,
    });
}

export function useAccountWallet() {
    return useQuery({
        queryKey: queryKey(api.account.wallet),
        queryFn: ({ signal }) => request(api.account.wallet, { signal }),
        select: (result) => result.data,
    });
}

export function useAccountTransactions() {
    return useQuery({
        queryKey: queryKey(api.account.transactions),
        queryFn: ({ signal }) => request(api.account.transactions, { signal }),
        select: (result) => result.data,
    });
}

export function useAccountCoupons() {
    return useQuery({
        queryKey: queryKey(api.account.coupons),
        queryFn: ({ signal }) => request(api.account.coupons, { signal }),
        select: (result) => result.data,
    });
}

export function useAccountReferrals() {
    return useQuery({
        queryKey: queryKey(api.account.referrals),
        queryFn: ({ signal }) => request(api.account.referrals, { signal }),
        select: (result) => result.data,
    });
}

export function useAccountProfileMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: AccountProfileInput) => request(api.account.updateProfile, { body }),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: [api.account.profile.resource] });
        },
    });
}
