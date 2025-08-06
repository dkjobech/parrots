Rails.application.routes.draw do
  get 'queues/new'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  root "main#home"
  get "about" => "main#about"

  post "/queue", to: "queues#create"

  require "sidekiq/web"
  mount Sidekiq::Web => "/sidekiq"

  mount ActionCable.server => "/cable"

end

