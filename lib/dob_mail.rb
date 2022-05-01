require 'aws-sdk-ses'


class DOBMail
  def initialize
    @sender = 'flyingmoonlightrecords@gmail.com'
    @recipients = %w[hcnewsom@gmail.com, david@inca.org]
    #@recipients = %w[hcnewsom@gmail.com]

    # The subject line for the email.
    @subject = 'DOB Complaint Watch'

    # The HTML body of the email.

    # The email body for recipients with non-HTML email clients.
    @textbody = 'This email was sent with Amazon SES using the AWS SDK for Ruby.'

    # Specify the text encoding scheme.
    @encoding = 'UTF-8'

    # Create a new SES client in the us-west-2 region.
    # Replace us-west-2 with the AWS Region you're using for Amazon SES.
    @ses = Aws::SES::Client.new(region: 'us-east-1')
  end

  def configure_message(body)
    return {
      destination: {
        to_addresses: @recipients
      },
      message: {
        body: {
          html: {
            charset: @encoding,
            data: body
          },
          text: {
            charset: @encoding,
            data: @textbody
          }
        },
        subject: {
          charset: @encoding,
          data: @subject
        }
      },
      source: @sender,
    }
  end

  def send(message)
    begin
      message = self.configure_message(message)
      @ses.send_email(message)
      @recipients.each {|r|  puts 'Email sent to ' + r}
    rescue Aws::SES::Errors::ServiceError => error
      puts "Email not sent. Error message: #{error}"
    end
  end
end
