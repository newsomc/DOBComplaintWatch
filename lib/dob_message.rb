require 'aws-sdk-sns'  # v2: require 'aws-sdk'

class DOBMessage
  def initialize
    region = 'us-east-1'
    @sns_client = Aws::SNS::Client.new(region: region)
    @phone_numbers = %w[+16467336680, +16463730769]
  end

  def message_sent?(message)
    begin
      @phone_numbers.each do |phone_number|
        @sns_client.publish(
          phone_number: phone_number,
          message: message
        )
      end
      return true
    rescue StandardError => e
      puts "Error while sending the message: #{e.message}"
      return false
    end
  end

  def send(message)
    puts "Message sending."
    if message_sent?(message)
      puts 'The message(s) were sent.'
    else
      puts 'The message(s) were not sent. Stopping program.'
    end
  end
end
