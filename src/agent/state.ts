export interface AgentState {
    repoId?: number
    repoName?: string
    repoOwner?: string
    branchName?: string
    task?: string
    isComplete: boolean
    setRepo(id: number, name: string, owner: string): void
    setBranch(name: string): void
    setTask(task: string): void
    complete(): void
    canResume(): boolean
}

export class InMemoryAgentState implements AgentState {
    repoId?: number
    repoName?: string
    repoOwner?: string
    branchName?: string
    task?: string
    isComplete: boolean = false

    setRepo(id: number, name: string, owner: string): void {
        this.repoId = id
        this.repoName = name
        this.repoOwner = owner
    }

    setBranch(name: string): void {
        this.branchName = name
    }

    setTask(task: string): void {
        this.task = task
    }

    complete(): void {
        this.isComplete = true
    }

    canResume(): boolean {
        return !this.isComplete && this.repoId !== undefined
    }
} 