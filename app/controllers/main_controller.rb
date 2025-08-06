# frozen_string_literal: true

class MainController < ApplicationController

  def home
    @room = Random.new.random_number(100)
  end

  def about
    @title = "About"
  end

end
