class LlmRequestJob < ApplicationJob
  queue_as :default

  def perform(*args)

    sleep(2)
    room_id = args[0][:room_id]
    MessageService.call(room_id: room_id, message: "Making call to llm from background job: #{room_id}")

    Rails.logger.info "Doing the llm job, room: #{room_id}" + args.join(" ")

    llm_response = LlmService.new.get_joke()
    message = llm_response.choices.first.message.content

    if message
      MessageService.call(room_id: room_id, message: message)
    else
      Rails.logger.info "No message returned from LLM #{room_id}"
    end
  end
end
