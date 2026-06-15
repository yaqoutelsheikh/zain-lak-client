"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, request } from "@/api";
import type { ConfirmInput, LoginInput, RecoverInput, RegisterInput, ResetInput } from "@/features/auth/schema";
import type { SocialProvider } from "@/features/auth/types";
import { clear, set } from "@/lib/auth/token";

type SocialInput = {
    provider: SocialProvider;
    body?: Record<string, unknown>;
};

function remember ( token: string ) {

    set(token);

}

export function useAuth () {

    const queryClient = useQueryClient();

    const login = useMutation({
        mutationFn: ( body: LoginInput ) => request(api.auth.login, { body }),
        onSuccess: (result) => remember(result.data.token),
    });

    const register = useMutation({
        mutationFn: ( body: RegisterInput ) => request(api.auth.register, { body }),
        onSuccess: (result) => remember(result.data.token),
    });

    const recovery = useMutation({
        mutationFn: ( body: RecoverInput ) => request(api.auth.recovery, { body }),
    });

    const reset = useMutation({
        mutationFn: ( body: ResetInput ) => request(api.auth.reset, { body }),
    });

    const confirm = useMutation({
        mutationFn: ( body: ConfirmInput ) => request(api.auth.confirm, { body }),
    });

    const social = useMutation({
        mutationFn: ({ provider, body = {} }: SocialInput) => request(api.auth.socialLogin, { params: { provider }, body }),
        onSuccess: (result) => remember(result.data.token),
    });

    const logout = useMutation({
        mutationFn: () => request(api.auth.logout),
        onSettled: () => {

            clear();
            queryClient.clear();

        },
    });

    return {
        login,
        register,
        recovery,
        reset,
        confirm,
        social,
        logout,
    };

}
