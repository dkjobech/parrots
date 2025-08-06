class RoomChannel < ApplicationCable::Channel
  def subscribed

    room = params[:room]
    stream_from room
    Rails.logger.info "Subscribed to room: #{room}"
  end

  def unsubscribed
    Rails.logger.info "Removed from room: #{room}"
  end
end
