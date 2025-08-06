# frozen_string_literal: true

class MessageService
  def self.call(room_id:, message:)
    new(room_id: room_id, message: message).call
  end

  def initialize(room_id:, message:)
    @room = "room_#{room_id}"
    @message = message
  end

  def call
    # Broadcast to Action Cable
    ActionCable.server.broadcast(@room, {
      message: @message,
      timestamp: Time.current,
      type: 'joke'
    })

    Rails.logger.info "Message broadcast to room: #{@room}: #{@message}"
  end

  private

  attr_reader :room_id, :message
end