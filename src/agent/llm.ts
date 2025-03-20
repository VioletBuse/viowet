export interface LLMResponse {
    content: string
    error?: string
}

export enum ModelLevel {
    Basic = "basic",      // For simple tasks, faster, cheaper
    Standard = "standard", // For most tasks, balanced performance
    Advanced = "advanced"  // For complex tasks, highest intelligence
}

export type LLMMessageRole = "developer" | "system" | "user" | "assistant" | "tool" | "function"

export interface BaseMessage {
    role: LLMMessageRole
    name?: string
}

export interface DeveloperMessage extends BaseMessage {
    role: "developer"
    content: string | Array<any>
}

export interface SystemMessage extends BaseMessage {
    role: "system"
    content: string | Array<any>
}

export interface UserMessage extends BaseMessage {
    role: "user"
    content: string | Array<any>
}

export interface FunctionCall {
    name: string
    arguments: string
}

export interface ToolCall {
    id: string
    type: "function"
    function: {
        name: string
        arguments: string
    }
}

export interface AssistantMessage extends BaseMessage {
    role: "assistant"
    content?: string | Array<any>
    function_call?: FunctionCall
    tool_calls?: ToolCall[]
    refusal?: string | null
}

export interface ToolMessage extends BaseMessage {
    role: "tool"
    content: string | Array<any>
    tool_call_id: string
}

export interface FunctionMessage extends BaseMessage {
    role: "function"
    content: string | null
    name: string
}

export type LLMMessage =
    | DeveloperMessage
    | SystemMessage
    | UserMessage
    | AssistantMessage
    | ToolMessage
    | FunctionMessage

export interface LLMQuery {
    messages: LLMMessage[]
    model?: string
    temperature?: number
    max_tokens?: number
    top_p?: number
    frequency_penalty?: number
    presence_penalty?: number
}

export class LLMQueryBuilder {
    private messages: LLMMessage[] = []
    private model: string = "gpt-4"
    private temperature?: number
    private max_tokens?: number
    private top_p?: number
    private frequency_penalty?: number
    private presence_penalty?: number

    addDeveloperMessage(content: string | Array<any>, name?: string): this {
        this.messages.push({
            role: "developer",
            content,
            ...(name && { name })
        })
        return this
    }

    addSystemMessage(content: string | Array<any>, name?: string): this {
        this.messages.push({
            role: "system",
            content,
            ...(name && { name })
        })
        return this
    }

    addUserMessage(content: string | Array<any>, name?: string): this {
        this.messages.push({
            role: "user",
            content,
            ...(name && { name })
        })
        return this
    }

    addAssistantMessage(content?: string | Array<any>, name?: string): this {
        this.messages.push({
            role: "assistant",
            ...(content && { content }),
            ...(name && { name })
        })
        return this
    }

    addAssistantFunctionCall(name: string, arguments_: string, name_?: string): this {
        this.messages.push({
            role: "assistant",
            function_call: { name, arguments: arguments_ },
            ...(name_ && { name: name_ })
        })
        return this
    }

    addAssistantToolCalls(toolCalls: ToolCall[], name?: string): this {
        this.messages.push({
            role: "assistant",
            tool_calls: toolCalls,
            ...(name && { name })
        })
        return this
    }

    addAssistantRefusal(refusal: string, name?: string): this {
        this.messages.push({
            role: "assistant",
            refusal,
            ...(name && { name })
        })
        return this
    }

    addToolMessage(content: string | Array<any>, toolCallId: string, name?: string): this {
        this.messages.push({
            role: "tool",
            content,
            tool_call_id: toolCallId,
            ...(name && { name })
        })
        return this
    }

    addFunctionMessage(content: string | null, name: string): this {
        this.messages.push({
            role: "function",
            content,
            name
        })
        return this
    }

    setModel(model: string): this {
        this.model = model
        return this
    }

    setTemperature(temperature: number): this {
        this.temperature = temperature
        return this
    }

    setMaxTokens(maxTokens: number): this {
        this.max_tokens = maxTokens
        return this
    }

    setTopP(topP: number): this {
        this.top_p = topP
        return this
    }

    setFrequencyPenalty(penalty: number): this {
        this.frequency_penalty = penalty
        return this
    }

    setPresencePenalty(penalty: number): this {
        this.presence_penalty = penalty
        return this
    }

    build(): LLMQuery {
        return {
            messages: this.messages,
            model: this.model,
            ...(this.temperature !== undefined && { temperature: this.temperature }),
            ...(this.max_tokens !== undefined && { max_tokens: this.max_tokens }),
            ...(this.top_p !== undefined && { top_p: this.top_p }),
            ...(this.frequency_penalty !== undefined && { frequency_penalty: this.frequency_penalty }),
            ...(this.presence_penalty !== undefined && { presence_penalty: this.presence_penalty })
        }
    }

    clear(): this {
        this.messages = []
        this.model = "gpt-4"
        this.temperature = undefined
        this.max_tokens = undefined
        this.top_p = undefined
        this.frequency_penalty = undefined
        this.presence_penalty = undefined
        return this
    }
}

export interface LLMService {
    query(query: LLMQuery, modelLevel: ModelLevel): Promise<LLMResponse>
}

export class OpenAIService implements LLMService {
    private readonly modelMap: Record<ModelLevel, string> = {
        [ModelLevel.Basic]: "gpt-3.5-turbo",
        [ModelLevel.Standard]: "gpt-4",
        [ModelLevel.Advanced]: "gpt-4-turbo-preview"
    }

    constructor(private apiKey: string) {
        if (!apiKey) {
            throw new Error("OpenAI API key is required")
        }
    }

    async query(query: LLMQuery, modelLevel: ModelLevel): Promise<LLMResponse> {
        try {
            const model = this.modelMap[modelLevel]
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    ...query,
                    model
                })
            })

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`)
            }

            const data = await response.json()
            return {
                content: data.choices[0].message.content
            }
        } catch (error) {
            return {
                content: "",
                error: error instanceof Error ? error.message : "Unknown error occurred"
            }
        }
    }
} 