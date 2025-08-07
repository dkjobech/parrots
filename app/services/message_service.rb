# frozen_string_literal: true

class MessageService
  def self.call(id:, room_id:, message:)
    new(id: id, room_id: room_id, message: message).call
  end

  def initialize(id:, room_id:, message:)
    @id = id
    @room = "room_#{room_id}"
    @message = message
  end

  def call
    # Broadcast to Action Cable
    ActionCable.server.broadcast(@room, {
      id: @id,
      message: @message,
      timestamp: Time.current,
      type: 'joke'
    })

    Rails.logger.info "Message broadcast to room: #{@room}: #{@message}"
  end

  private

  attr_reader :room_id, :message
end