import { createOAuthDeviceAuth } from '@octokit/auth-oauth-device';
import { config } from './conf';
import { Octokit } from '@octokit/core';
import { CLI, Command } from 'cliffy';

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

export const is_logged_in = async () => {
    const stored_password = await config.get('token')

    if (stored_password === null || stored_password === undefined) {
        return false
    }

    const client = new Octokit({
        auth: stored_password
    });

    try {
        await client.request("GET /user")
        return true
    } catch (e) {
        return false
    }
}

export const clear_token = async () => {
    await OctokitClientManager.getInstance().clearToken()
}

export const auth_commands = (cli: CLI): Command => ({
    description: "Authentication commands. For more info run `help auth`",
    async action() {
        cli.showHelp()
    },
    subcommands: {
        logout: {
            description: "Clear stored token",
            async action() {
                await clear_token()
                console.log("🔓 Token cleared")
            }
        },
        login: {
            description: "Login to Github",
            async action() {
                await get_octokit()
                console.log("🔒 Logged in")
            }
        },
        status: {
            description: "Check login status",
            async action() {
                const Login_status = await is_logged_in()
                if (Login_status) {
                    console.log("🔒 Logged in")
                } else {
                    console.log("🔓 Not logged in")
                }
            }
        }
    }
})

