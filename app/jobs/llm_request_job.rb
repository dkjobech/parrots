class LlmRequestJob < ApplicationJob
  queue_as :default

  def perform(*args)

    sleep(2)
    room_id = args[0][:room_id]
    MessageService.call(id: "3", room_id: room_id, message: "[worker] Job removed from queue: #{room_id}")

    sleep(2)
    MessageService.call(id: "4", room_id: room_id, message: "[worker] Submitting request to LLM: #{room_id}")

    llm_response = LlmService.new.get_joke()
    message = llm_response.choices.first.message.content

    sleep(2)
    MessageService.call(id: "5", room_id: room_id, message: "[worker] Received LLM response: #{room_id}")
    sleep(2)

    if message
      MessageService.call(id: "6", room_id: room_id, message: message)
    else
      Rails.logger.info "No message returned from LLM #{room_id}"
    end
  end
end
