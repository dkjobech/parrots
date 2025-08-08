class LlmRequestJob < ApplicationJob
  queue_as :default

  def perform(*args)

    room_id = args[0][:room_id]
    delay = args[0][:delay]

    sleep(delay)
    MessageService.call(id: "3", room_id: room_id, message: "[worker] Job removed from queue: #{room_id}")

    sleep(delay)
    MessageService.call(id: "4", room_id: room_id, message: "[worker] Submitting request to LLM: #{room_id}")

    message = LlmService.new.get_joke()

    sleep(delay)
    MessageService.call(id: "5", room_id: room_id, message: "[worker] Received LLM response: #{room_id}")

    sleep(delay)
    if message
      MessageService.call(id: "6", room_id: room_id, message: message)
    else
      Rails.logger.info "No message returned from LLM #{room_id}"
    end
  end
end
