import ora from "ora"
import { get_octokit } from "../github"
import inquirer from "inquirer"

export const run_agent = async () => {
    const octokit = await get_octokit()
    console.log("🤔 let's get thinking")
    const spinner = ora("Fetching Github repos").start()
    const repos = await octokit.request("GET /user/repos");

    spinner.stop()

    if (repos.status !== 200) {
        console.error("Failed to fetch repos")
        process.exit(1)
    }

    const repo = await inquirer.prompt([
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
        {
            type: "input",
            name: "branch",
            message: "What should I name the branch?"
        }
    ]);

    console.log(repo)
    console.log("🚀 Done")

}
