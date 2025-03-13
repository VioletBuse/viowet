
export interface LighthouseBackend {
    create_sandbox(base_image: string): Promise<string>
    destroy_sandbox(sandbox_id: string): Promise<void>
}
