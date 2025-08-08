class QueuesController < ApplicationController

  def create

    room = queue_params[:room]
    delay = queue_params[:delay] || 0

    Rails.logger.info "Queueing request for delay: #{delay}"
    Rails.logger.info "Queueing request for room: #{queue_params}"
    sleep(delay)

    MessageService.call(id: "1", room_id: room, message: "[web] Queueing request for room: #{room}")

    sleep(delay)

    # Queue the request
    LlmRequestJob.perform_later(room_id: room, delay: delay )

    MessageService.call(id: "2", room_id: room, message: "[web] Request queued: #{room}")

    render json: {
      status: 'queued',
      message: 'Request has been queued',
      room: room
    }

  rescue ActionController::ParameterMissing, ArgumentError => e
    render json: {
      error: 'Invalid room number. Must be between 0 and 100.',
      status: 'error'
    }, status: :bad_request

  end

  private

  def queue_params
    params.require(:room)
    room = params[:room].to_i
    raise ArgumentError unless room.between?(0, 100)

    delay = params[:delay].to_i if params[:delay].present?

    result = { room: room }
    result[:delay] = delay if delay
    result
  end

end
