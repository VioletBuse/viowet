import { LighthouseBackend } from "..";
import Docker from "dockerode"

export class DockerBackend implements LighthouseBackend {

    #docker: Docker;

    constructor() {
        this.#docker = new Docker();
    }

    async create_sandbox(base_image: string) {
        const new_container = await this.#docker.createContainer({ Image: base_image, Cmd: ['/bin/bash'] })
        const id = new_container.id;

        return id;
    }

    async destroy_sandbox(id: string) {
        await this.#docker.pruneContainers({ id })
    }

    async run_command(id: string, command: string[], directory: string, env: Record<string, string>) {
        const container = this.#docker.getContainer(id);

        const Env: string[] = Object.entries(env).map(([key, value]) => `${key}="${value}"`)

        const result = await container.exec({ Cmd: command, Env, WorkingDir: directory })

        // const id = result.
    }
}
