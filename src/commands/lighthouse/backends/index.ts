import { Request, Response } from "express"

export interface LighthouseBackend {
    create_sandbox(base_image: string): Promise<[string, null] | [null, string]>
    destroy_sandbox(sandbox_id: string): Promise<[1, null] | [null, string]>
}
