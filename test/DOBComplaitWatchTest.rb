require "minitest/autorun"
require "./lib/DOBComplaintWatch"

class FakeDOBMail
  def send
    "mail sent!"
  end
end

class FakeDOBMessage
  def send(message)
    message
  end
end

class TestDOBComplaintWatch < Minitest::Test
  def setup
    @complaintsRun = DOBComplaintWatch.new(
      FakeDOBMail.new,
      FakeDOBMessage.new
    )
    @today = Date.today
  end

  def test_format_date
    today = @today.strftime("%A, %B %d, %Y")
    assert_equal @complaintsRun.formatted_date, today
  end

  def test_send_complaint_message_if_new
    message_response = @complaintsRun.send_complaint_message_if_new("600 La Cruz", @today, "http://foo.com")
    assert_equal message_response, "DOB Complaint Watch: 600 La Cruz has a new DOB complaint. Visit link for more info: http://foo.com"
  end

  def test_is_within_three_days_is_true
    [@today - 2, @today - 1].each do |date|
      within_three_days = @complaintsRun.is_within_three_days?(date)
      assert_equal within_three_days, true
    end
  end

  def test_is_within_three_days_is_false
    [@today - 3, @today - 4].each do |date|
      within_three_days = @complaintsRun.is_within_three_days?(date)
      assert_equal within_three_days, false
    end
  end

  def test_has_complaints_no_complaints
    complaints = {
      "154_Scott" => [
        ["3832809", "154 SCOTT AVENUE", "02/23/2022", "7G", "02/23/2022", "A3", "RES"],
        ["3784299", "154 SCOTT AVENUE", "01/21/2021", "31", "03/12/2021", "I2", "RES"],
        ["3701757", "154 SCOTT AVENUE", "05/11/2019", "05", "09/20/2019", "L2", "RES"]
      ]
    }
    has_recent_complaints = @complaintsRun.format_complaints(complaints, "http://foo.com")
    assert_equal has_recent_complaints, [{"dates" => [], "has_recent_complaints" => false}]
  end

  def test_has_complaints_with_complaints
    one_day_ago = (Date.today - 1).strftime("%m/%d/%Y")
    two_days_ago = (Date.today - 2).strftime("%m/%d/%Y")
    three_days_ago = (Date.today - 3).strftime("%m/%d/%Y")
    complaints = {
      "154_Scott" => [
        ["3832809", "154 SCOTT AVENUE", one_day_ago, "7G", "02/23/2022", "A3", "RES"],
        ["3784299", "154 SCOTT AVENUE", two_days_ago, "31", "03/12/2021", "I2", "RES"],
        ["3701757", "154 SCOTT AVENUE", "05/11/2019", "05", "09/20/2019", "L2", "RES"]
      ],
      "600_LaCruz" => [
        ["3832809", "154 SCOTT AVENUE", three_days_ago, "7G", "02/23/2022", "A3", "RES"],
        ["3784299", "154 SCOTT AVENUE", two_days_ago, "31", "03/12/2021", "I2", "RES"],
        ["3701757", "154 SCOTT AVENUE", "05/11/2019", "05", "09/20/2019", "L2", "RES"]
      ],
    }
    has_recent_complaints = @complaintsRun.format_complaints(
      complaints, "http://foo.com"
    )
    assert_equal has_recent_complaints, [
      {
        "dates" => [(Date.today - 1).strftime("%m/%d/%Y"), (Date.today - 2).strftime("%m/%d/%Y")],
        "has_recent_complaints" => true
      },
      {
        "dates" => [(Date.today - 2).strftime("%m/%d/%Y")],
        "has_recent_complaints" => true
      }
    ]
  end

end