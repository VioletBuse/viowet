import { cli_version } from "./version"

export const download_binary_archive = async (platform: "linux" | "win" | "macos" = "linux"): Promise<Buffer> => {
    const download_link = `https://github.com/VioletBuse/viowet/releases/download/${cli_version}/viowet.${platform}.tar.gz`
    const archive = await fetch(download_link);
    const data = await archive.bytes();

    return Buffer.from(data)
}

export const download_binary = async (platform: "linux" | "win" | "macos" = "linux"): Promise<Buffer> => {
    const platform_suffix = platform === "win" ? "win.exe" : platform;
    const download_link = `https://github.com/VioletBuse/viowet/releases/download/${cli_version}/viowet-${platform_suffix}`
    const download = await fetch(download_link)
    const data = await download.bytes();

    return Buffer.from(data)
}