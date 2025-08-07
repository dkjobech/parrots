require "openai"

class LlmService
  DEFAULT_MODEL = "gpt-3.5-turbo"
  DEFAULT_SYSTEM_PROMPT = "You are a witty comedian. Tell a clean, one‑line joke about parrots."
  DEFAULT_TOPIC = "parrots"
  DEFAULT_MAX_TOKENS = 60
  DEFAULT_TEMPERATURE = 0.5

  def initialize(api_key: Rails.application.credentials.openai[:api_key] || ENV['OPENAI_API_KEY'])
    @client = OpenAI::Client.new(api_key: api_key)
  end

  def get_joke(
    topic: nil,
    model: DEFAULT_MODEL,
    max_tokens: DEFAULT_MAX_TOKENS,
    temperature: DEFAULT_TEMPERATURE,
    system_prompt: DEFAULT_SYSTEM_PROMPT
  )

    effective_topic = topic || DEFAULT_TOPIC
    messages = build_chat_messages(effective_topic, system_prompt)

    @client.chat.completions.create(
      model: model,
      messages: messages,
      max_tokens: max_tokens,
      temperature: temperature
    )
  end

  private

  def build_chat_messages(topic, system_prompt)
    [
      { role: "system", content: system_prompt },
      { role: "user", content: "Tell me a joke about #{topic}" }
    ]
  end
end