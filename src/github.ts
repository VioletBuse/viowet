import { createOAuthDeviceAuth } from '@octokit/auth-oauth-device';
import { config } from './conf';
import { Octokit } from '@octokit/core';

const auth = createOAuthDeviceAuth({
    clientType: 'oauth-app',
    clientId: 'Ov23liJtepRYSIZgBu3C',
    scopes: ['repo', "user"],
    onVerification: async (verification) => {
        console.log('Open %s', verification.verification_uri);
        console.log('Enter code: %s', verification.user_code);
    }
});

class OctokitClientManager {
    private static instance: OctokitClientManager;
    private client: Octokit | null = null;

    private constructor() { }

    static getInstance(): OctokitClientManager {
        if (!OctokitClientManager.instance) {
            OctokitClientManager.instance = new OctokitClientManager();
        }

        return OctokitClientManager.instance;
    }

    async getClient(): Promise<Octokit> {
        if (!this.client) {
            const stored_password = await config.get('token')
            let valid_passwd = stored_password !== null && stored_password !== undefined

            if (valid_passwd) {
                this.client = new Octokit({
                    auth: stored_password
                });
            } else {
                const { token } = await auth({ type: 'oauth' });
                await config.set('token', token)
                this.client = new Octokit({
                    auth: token,
                });
            }
        }

        return this.client;
    }

    async clearToken() {
        await config.delete('token')
        this.client = null
    }
}

export const get_octokit = async () => {
    return await OctokitClientManager.getInstance().getClient()
}

export const clear_token = async () => {
    await OctokitClientManager.getInstance().clearToken()
}

