require 'mechanize'
require 'pp'
require 'erb'
require_relative 'dob_mail'
require_relative 'dob_message'

class Addreses
  BROOKLYN = 3
  MANHATTAN = 1
  def self.locations
    return [

      {:houseno => 712, :street => 'Monroe', :road => 'street', :boro => BROOKLYN},
      {:houseno => 713, :street => 'Monroe', :road => 'street', :boro => BROOKLYN},
      {:houseno => 715, :street => 'Monroe', :road => 'street', :boro => BROOKLYN},
      {:houseno => 717, :street => 'Monroe', :road => 'street', :boro => BROOKLYN},
      {:houseno => 719, :street => 'Monroe', :road => 'street', :boro => BROOKLYN},
      {:houseno => '71OA', :street => 'Monroe', :road => 'street', :boro => BROOKLYN},
      {:houseno => '712A', :street => 'Monroe', :road => 'street', :boro => BROOKLYN},
      {:houseno => 990, :street => 'Metropolitan', :road => 'avenue', :boro => BROOKLYN},
      {:houseno => 154, :street => 'Scott', :road => 'avenue', :boro => BROOKLYN},
      {:houseno => 53, :street => 'Scott', :road => 'avenue', :boro => BROOKLYN},
      {:houseno => 25, :street => 'Stewart', :road => 'avenue', :boro => BROOKLYN},
      {:houseno => 309, :street => 'Starr', :road => 'street', :boro => BROOKLYN},
      {:houseno => 70, :street => 'Scott', :road => 'avenue', :boro => BROOKLYN},
      {:houseno => 690, :street => 'Humbolt', :road => 'street', :boro => BROOKLYN},
      {:houseno => 263, :street => 'Carroll', :road => 'street', :boro => BROOKLYN},
      {:houseno => 49, :street => 'Frost', :road => 'street', :boro => BROOKLYN},
      {:houseno => 504, :street => 'Grand', :road => 'street', :boro => MANHATTAN},
      {:houseno => 365, :street => 'Canal', :road => 'street', :boro => MANHATTAN},
      {:houseno => 197, :street => 'Grand', :road => 'street', :boro => MANHATTAN},
      {:houseno => 48, :street => 'Eldridge', :road => 'street', :boro => MANHATTAN},
      {:houseno => 435, :street => 'W18th', :road => 'street', :boro => MANHATTAN},
    ]
  end
end

class DOBComplaintWatch
  def initialize(mail_client, message_client)
    @base_url = "https://a810-bisweb.nyc.gov/bisweb/PropertyProfileOverviewServlet?"
    @mail_client = mail_client
    @message_client = message_client
  end

  def get_url(address)
    return @base_url + (
      "boro=#{address[:boro]}&houseno=#{address[:houseno]}&street=#{address[:street]}+#{address[:road]}&go2=+GO+&requestid=0"
    )
  end

  def get_complaint_table(page)
    table = page.css('table')[3]
    rows = table.css('tr')
    return rows.map do |row|
      row.css('td.content').search("[colspan=6]").remove
      filtered_cells = row.css('td.content').select do |cell|
        !(cell.content == " " or cell.content == "\\" or cell.content.empty?)
      end
      cell_values = filtered_cells.map(&:text)

      [*cell_values]
    end.select {|row| !row.empty?}
  end

  def get_total_and_open_complaints(page)
    table = page.css('table')[8]
    if table
      if tds = table.css('tr')[2]
        cells = tds.children
        return {
          :total => cells[3].content,
          :open => cells[5].content
        }
      else
        return nil
      end
    end
    return nil
  end

  def get_page(client, url)
    begin
      page = client.get(url)
    rescue Mechanize::ResponseCodeError => e
      abort("GET: Response code #{e.response_code} for Url: #{url}")
    end
    page
  end

  def click_link(link)
    begin
      page = link.click
    rescue Mechanize::ResponseCodeError => e
      abort("CLICK: Response code #{e.response_code} for Link: #{link.href}")
    end
    page
  end

  def is_within_three_days?(complaint_date)
    today = Date.today
    return (today == complaint_date or (today - 1) == complaint_date or (today - 2) == complaint_date)
  end

  def is_today?(complaint_date)
    today = Date.today
    today == complaint_date
  end

  def send_complaint_message_if_new(address, date, dob_url)
    if self.is_today?(date)
      @message_client.send(
        "DOB Complaint Watch: #{address} has a new DOB complaint. Visit link for more info: #{dob_url}"
      )
    end
  end

  def _select_recent_complaints(address, complaint_dates, dob_url)
    recent_complaints = complaint_dates.select do |date_string|
      date_array = date_string.split("/").map(&:to_i)
      date = Date.new(date_array[2], date_array[0], date_array[1]) # year, month, day
      self.send_complaint_message_if_new(address, date, dob_url)
      self.is_within_three_days?(date) ? date : false # alert for 3 days
    end
    recent_complaints
  end

  def format_complaints(complaints, dob_url)
    vals = []
    complaints.each do |address, complaints|
      complaint_dates = complaints.collect {|v| v[2]}
      recent_complaint_dates = self._select_recent_complaints(address, complaint_dates, dob_url)
      vals.push(
        {
          'dates' => recent_complaint_dates,
          'has_recent_complaints' => !recent_complaint_dates.empty?
        }
      )
    end
    vals
  end

  def has_stop_work_order?(page)
    not page.css('td.RedBanner').empty?
  end

  def stop_work_order_content(page)
    page.css('td.RedBanner')[0].content
  end

  def formatted_date
    Date.today.strftime("%A, %B %d, %Y")
  end

  def get_complaints(page)
    complaints = nil
    page.links.each do |link|
      if link.text == "Complaints"
        new_page = self.click_link(link)
        complaints = self.get_complaint_table(new_page)
      end
    end
    complaints
  end

  def get_alerts
    mechanize = Mechanize.new { |a|
      a.user_agent_alias = 'Mac Safari'
    }

    results = []
    Addreses.locations.each do |address|
      address_key = "#{address[:houseno]}_#{address[:street]}"
      dob_url = self.get_url(address)
      _address = {
        address_key => {
          :dob_url => dob_url,
          :name => "#{address[:houseno]} #{address[:street]} #{address[:road].capitalize}"
        }
      }

      page = self.get_page(mechanize, dob_url)
      complaints = self.get_complaints(page)
      total_and_open_complaints = self.get_total_and_open_complaints(page)
      if not total_and_open_complaints.nil?
        _address[address_key].merge!(
          {
            :total_and_open_complaints => total_and_open_complaints
          })
      end
      if not complaints.nil?
        formatted_complaint_data = {
          :complaints => self.format_complaints(
            { address_key => complaints}, dob_url
          )
        }
        _address[address_key].merge!(formatted_complaint_data)
      end

      has_stop_work_order = self.has_stop_work_order?(page)
      _address[address_key].merge!(
        {:has_stop_work_order => has_stop_work_order}
      )

      if has_stop_work_order
        _address[address_key].merge!({
          :stop_work_order_td_content =>  self.stop_work_order_content(page)
        })
      end
      results.push(_address)
    end

    self.get_template(results)
  end

  def get_template(results)
    template = ERB.new(File.read('./templates/template.erb'))
    template.result_with_hash(
      formatted_date: self.formatted_date, results: results
    )
  end

  def run
    alerts = self.get_alerts
    @mail_client.send(alerts)
  end
end

# run if command line call
if __FILE__== $0
  complaintsRun = DOBComplaintWatch.new(
    DOBMail.new,
    DOBMessage.new
  )
  complaintsRun.run
end
