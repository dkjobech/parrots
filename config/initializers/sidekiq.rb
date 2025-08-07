def build_redis_url(database = 0)
  host = ENV.fetch("REDIS_HOST", "parrots-redis")
  port = ENV.fetch("REDIS_PORT", "6379")
  "redis://#{host}:#{port}/#{database}"
end

sidekiq_redis_url = ENV.fetch("SIDEKIQ_REDIS_URL", build_redis_url(0))

Sidekiq.configure_server do |config|
  config.redis = { url: sidekiq_redis_url }
end

Sidekiq.configure_client do |config|
  config.redis = { url: sidekiq_redis_url }
end