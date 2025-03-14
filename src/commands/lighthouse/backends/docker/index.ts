import { LighthouseBackend } from "..";
import portfinder from "portfinder"
import Docker from "dockerode"
import { download_binary_archive } from "../../../../util/binary";
import { Request, Response } from "express";
import proxy from "express-http-proxy";

export class DockerBackend implements LighthouseBackend {

    #docker: Docker;

    constructor() {
        this.#docker = new Docker();
    }

    async create_sandbox(base_image: string): ReturnType<LighthouseBackend['create_sandbox']> {
        try {
            await this.#docker.pull(base_image);

            const port = await portfinder.getPortPromise({
                port: 55000
            });

            const container = await this.#docker.createContainer({
                Image: base_image,
                Cmd: ["/usr/local/bin/viowet", "worker", "--port", "8080"],
            });

            const archive = await download_binary_archive();
            await container.putArchive(archive, {
                path: "/usr/local/bin"
            });

            await container.start();

            return [container.id, null]
        } catch (err) {
            if (err instanceof Error && err.message) {
                return [null, err.message]
            } else {
                return [null, "An unknown error occurred."]
            }
        }
    }

    async destroy_sandbox(id: string): ReturnType<LighthouseBackend["destroy_sandbox"]> {
        try {
            const container = this.#docker.getContainer(id)
            await container.remove();

            return [1, null]
        } catch (err) {
            if (err instanceof Error && err.message) {
                return [null, err.message]
            } else {
                return [null, "An unknown error occurred."]
            }
        }
    }

}