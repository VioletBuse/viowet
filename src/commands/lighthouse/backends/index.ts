
export interface LighthouseBackend {
    create_sandbox(base_image: string): Promise<string>
    destroy_sandbox(sandbox_id: string): Promise<void>
    run_command(sandbox_id: string, command: string, directory: string, env: Record<string, string>): Promise<void>
}
