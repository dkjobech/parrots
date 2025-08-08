require "openai"

class LlmService
  DEFAULT_MODEL = "gpt-3.5-turbo"
  #DEFAULT_MODEL = "gpt-4o"
  DEFAULT_SYSTEM_PROMPT = "You are a witty comedian. You tell clean, short jokes about topics you are provided. Each joke you tell is different from the last."
  DEFAULT_TOPIC = "parrots"
  DEFAULT_MAX_TOKENS = 150
  DEFAULT_TEMPERATURE = 0.7

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
      temperature: temperature,
      top_p: 0.9,             # Nucleus sampling
      frequency_penalty: 0.5,  # Avoid repetition
      presence_penalty: 0.3    # Encourage new topics

    ).choices.first.message.content

  end

  private

  def generate_joke_prompt(topic)
    styles = ["pun", "one-liner", "knock-knock", "observational", "wordplay", "absurd"]
    style = styles.sample
    timestamp = Time.now.to_f
    prompt = "Session #{timestamp}: Tell me a #{style} joke about #{topic}. Make it original and different from any joke you've told before."
    Rails.logger.info "Prompt: #{prompt}"
    prompt
  end


  def build_chat_messages(topic, system_prompt)
    [
      { role: "system", content: system_prompt },
      { role: "user", content: generate_joke_prompt(topic) }
    ]
  end
end