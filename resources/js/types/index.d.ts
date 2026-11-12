export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};

// public/downloads/version.json, written by the operator app's scripts/release.sh
export interface ApkInfo {
    version_name: string;
    version_code: number;
    changelog: string;
    release_date?: string;
    size_bytes?: number;
    sha256?: string;
}
