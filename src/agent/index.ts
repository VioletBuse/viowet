import { get_octokit, is_logged_in } from "../github"
import { Command } from "cliffy"
import { AgentOutput, AgentOutputTerminal } from "./output"
import { AgentState, InMemoryAgentState } from "./state"
import { LLMService, OpenAIService, LLMQueryBuilder, ModelLevel } from "./llm"

export const run_agent = async (
    output: AgentOutput = new AgentOutputTerminal(),
    state: AgentState = new InMemoryAgentState(),
    llm: LLMService = new OpenAIService(process.env.OPENAI_API_KEY || "")
): Promise<void> => {
    const login_status = await is_logged_in()

    if (!login_status) {
        output.error("Please login to github using the `auth login` command")
        return
    }

    const octokit = await get_octokit()

    if (!state.repoId) {
        output.startSpinner("Fetching Github repos")
        const repos = await octokit.request("GET /user/repos");
        output.stopSpinner()

        if (repos.status !== 200) {
            output.error("Failed to fetch repos")
            return
        }

        const repoId = await output.promptList(
            "Select a repo",
            repos.data.map((repo) => ({
                name: repo.full_name,
                value: repo.id
            }))
        )

        const selectedRepo = repos.data.find(repo => repo.id === repoId)
        if (!selectedRepo) {
            output.error("Selected repo not found")
            return
        }

        state.setRepo(
            selectedRepo.id,
            selectedRepo.name,
            selectedRepo.owner.login
        )
    }

    if (!state.branchName) {
        output.startSpinner("Fetching branches")
        const branches = await octokit.request("GET /repos/{owner}/{repo}/branches", {
            owner: state.repoOwner!,
            repo: state.repoName!
        })
        output.stopSpinner()

        if (branches.status !== 200) {
            output.error("Failed to fetch branches")
            return
        }

        const branchName = await output.promptList(
            "Select a branch",
            branches.data.map((branch) => ({
                name: branch.name,
                value: branch.name
            }))
        )

        state.setBranch(branchName)
    }

    if (!state.task) {
        const task = await output.promptInput("What should I do?")
        state.setTask(task)
    }


}

export const run_agent_command = (): Command => ({
    description: "Run the agent",
    action: async () => {
        await run_agent()
    }
})
