import ora, { Ora } from "ora"
import inquirer from "inquirer"

export interface AgentOutput {
    startSpinner(message: string): void
    stopSpinner(): void
    promptList<T>(message: string, choices: Array<{ name: string, value: T }>): Promise<T>
    promptInput(message: string): Promise<string>
    promptConfirm(message: string): Promise<boolean>
    log(message: string): void
    error(message: string): void
}

export class AgentOutputTerminal implements AgentOutput {
    private spinner: Ora | null = null

    startSpinner(message: string): void {
        this.spinner = ora(message).start()
    }

    stopSpinner(): void {
        if (this.spinner) {
            this.spinner.stop()
            this.spinner = null
        }
    }

    async promptList<T>(message: string, choices: Array<{ name: string, value: T }>): Promise<T> {
        const response = await inquirer.prompt([{
            type: "list",
            name: "result",
            message,
            choices
        }])
        return response.result
    }

    async promptInput(message: string): Promise<string> {
        const response = await inquirer.prompt([{
            type: "input",
            name: "result",
            message
        }])
        return response.result
    }

    async promptConfirm(message: string): Promise<boolean> {
        const response = await inquirer.prompt([{
            type: "confirm",
            name: "result",
            message
        }])
        return response.result
    }

    log(message: string): void {
        console.log(message)
    }

    error(message: string): void {
        console.error(message)
    }
} 