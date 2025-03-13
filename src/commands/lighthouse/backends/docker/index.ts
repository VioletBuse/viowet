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
}
