import ora from "ora"
import { get_octokit, is_logged_in } from "../github"
import inquirer from "inquirer"
import { Command } from "cliffy"

export const run_agent = async (): Promise<void> => {
    const login_status = await is_logged_in()

    if (!login_status) {
        console.error("Please login to github using the `auth login` command")
        return
    }

    const octokit = await get_octokit()
    const spinner = ora("Fetching Github repos").start()
    const repos = await octokit.request("GET /user/repos");

    spinner.stop()

    if (repos.status !== 200) {
        console.error("Failed to fetch repos")
        return
    }

    const data = await inquirer.prompt([
        {
            type: "list",
            name: "repo",
            message: "Select a repo",
            choices: repos.data.map((repo) => ({
                name: repo.full_name,
                value: repo.id
            }))
        },
        {
            type: "input",
            name: "task",
            message: "What should I do?"
        },
    ])

    console.log(data)
    console.log("🚀 Done")
}

export const run_agent_command = (): Command => ({
    description: "Run the agent",
    action: async () => {
        await run_agent()
    }
})
