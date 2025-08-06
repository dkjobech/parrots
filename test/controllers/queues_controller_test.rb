require "test_helper"

class QueuesControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get queues_new_url
    assert_response :success
  end
end
