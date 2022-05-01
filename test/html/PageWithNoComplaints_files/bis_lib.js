// this lib is a collection of javascript functions that are used in bis pages

function winclose(){
	window.close();
}

function GoBack(){
	{
	  	if (navigator.appName == "Netscape")
			{
  	     	window.back();
			return true
			}
  		if (navigator.appName=="Microsoft Internet Explorer")
			{
        	window.history.back();
			return true
			}
	}
}

function print_today(){
	var now = new Date();
	var day = now.getDate();
	var month = now.getMonth();
	var year = now.getFullYear();
	// defines full English names for the months
    monthName = new Array(12)
    monthName[0]  = 'Jan'
    monthName[1]  = 'Feb'
    monthName[2]  = 'Mar'
    monthName[3]  = 'Apr'
    monthName[4]  = 'May'
    monthName[5]  = 'Jun'
    monthName[6]  = 'Jul'
    monthName[7]  = 'Aug'
    monthName[8]  = 'Sep'
    monthName[9]  = 'Oct'
    monthName[10] = 'Nov'
    monthName[11] = 'Dec'
	var today = monthName[month] + ' ' + day + ', ' + year
	document.write('&nbsp;&nbsp;' + today + '&nbsp;');
}

function checkSelect(select, badVal, literal)
{
	if(select.options[select.selectedIndex].value == badVal)
	{
		alert("Please select a valid " + literal + " before continuing.");
		return false;
	}
	return true;
}
function checkText(text, literal)
{
	if(text.value == "" || text.value .match(/^\s+$/))
	{
		alert("Please enter a valid " + literal + " before continuing.");
		return false;
	}
	return true;
}
function checkZipCode(text, literal)
{
	if( !isNaN(text.value) && (text.value.length == 5)){ return true; }

	alert("Please enter a valid " + literal + " before continuing.");
	return false;
}
function checkNumber(text, literal)
{

	if(text.value == "" || isNaN(text.value) )
	{
		alert("Please enter a valid " + literal + " before continuing.");
		return false;
	}
	return true;
}
function checkDateRange(smonth, sday, syear, emonth, eday, eyear, sname, ename)
{
	if(emonth == "" && eday == "" && eyear == "")
	{
		return true;
	}
	var sdate = new Date(syear, smonth - 1, sday);
	var edate = new Date(eyear, emonth - 1, eday);
	if(edate < sdate)
	{
		alert("The date range specified by " + sname + " and " + ename + " is not valid.");
		return false;
	}
	//if((edate - sdate) > 34560000000)
	//{
	//	alert("Please limit your date range to 400 days, or leave the end date field blank.");
	//	return false;
	//}
	return true;
}
function checkDateNotReqd(month, month_name, day, day_name, year, year_name, date, date_name)
{
	if(month != "" || day != "" || year != "")
	{
		return checkDate(month, month_name, day, day_name, year, year_name, date, date_name);
	}
	return true;
}
function checkDate(month, month_name, day, day_name, year, year_name, date_name)
{
	var reg = /^\d\d$/;
	if(! (reg.test(month)))
	{
		alert("Please select a " + month_name + " before submitting.");
		return false;
	}

	reg = /^\d\d?$/;
	if(! (reg.test(day)) || (day < 1))
	{
		alert("Please enter a valid " + day_name + " before submitting.");
		return false;
	}

	reg = /^\d\d\d\d$/;
	if(! (reg.test(year)) || (year < 1))
	{
		alert("Please enter a valid " + year_name + " before submitting.");
		return false;
	}
	if(
		(
		 (month == "01" || month == "03" || month == "05" || month == "07" ||
		  month == "08" || month == "10" || month == "12") &&
		 (day > 31)
		) ||
		(
		 (month == "04" || month == "06" || month == "09" || month == "11") &&
		 (day > 30)
		) ||
		(
		 (month == "02") && (day > 29) && ( (year % 4) == 0 || (year % 100) == 0 )
		) ||
		(
		 (month == "02") && (day > 28) && !( (year % 4) == 0 || (year % 100) == 0 )
		)
	)
	{
		alert(month + "/" + day + "/" + year + " is not a valid " + date_name + ".  Please enter a valid date before submitting.");
		return false;
	}

	return true;
}
function verifyEsubmitLogin(form)
{
	if(!checkText(form.esuserid, "BIS ID")) { return false; }

	if(!checkSelect(form.esubmitrole, "0", "role")) { return false; }
	if(!checkSelect(form.boro, "0", "borough")) { return false; }

	return true;

}

function verifySearchP_A(form)
{
	if(!checkSelect(form.boro, "0", "borough")) { return false; }
	if(!checkText(form.houseno, "house number")) { return false; }
	if(!checkText(form.street, "street")) { return false; }
	return true;
}
function verifySearchP_B(form)
{
	if(!checkSelect(form.boro, "0", "borough")) { return false; }
	if(!checkText(form.block, "block")) { return false; }
	if(!checkText(form.lot, "lot")) { return false; }
	return true;
}
function verifySearchP_C(form)
{
	if(!checkText(form.bin, "bin")) { return false; }
	return true;
}
function verifySearchP_D(form)
{
	if(!checkText(form.complaintno, "complaint number")) { return false; }
	return true;
}
function verifySearchP_E(form)
{
	if(!checkText(form.ecbin, "violation number")) { return false; }
	return true;
}
function verifySearchP_F(form)
{
	if(!checkText(form.allbin, "bin")) { return false; }
	return true;
}

function verifyContractorSearch_N(form)
{
	if(!checkText(form.contno,"contractor number")) { return false; }
	return true;
}
function verifyContractorSearch_M(form)
{
	if(!checkText(form.bizname,"business name")) { return false; }
	return true;
}
function verifyContractorSearch_Z(form){
	if(!checkZipCode(form.zipcode,"zip code")) { return false; }
	return true;
}

function verifySearchP_G(form)
{
	if(!checkSelect(form.allviolationtype, "", "violation type")) { return false; }
	with(form)
	{
		var startmonth = allstartdate_month.options[allstartdate_month.selectedIndex].value;
		var startday = allstartdate_day.value;
		var startyear = allstartdate_year.value;
		var endmonth = allenddate_month.options[allenddate_month.selectedIndex].value;
		var endday = allenddate_day.value;
		var endyear = allenddate_year.value;

		if(!checkDate(startmonth, "start month", startday, "start day", startyear, "start year", "start date")) { return false; }
		if(!checkDateNotReqd(endmonth, "end month", endday, "end day", endyear, "end year", "end date")) { return false; }

		if(!checkDateRange(startmonth, startday, startyear, endmonth, endday, endyear, "start date", "end date")) { return false; }
	}
}
function verifySearchP_H(form)
{
	if(!checkText(form.passjobnumber, "job number")) { return false; }
	return true;
}
function verifySearchP_I(form)
{
	if(!checkText(form.passjobnumber, "application number")) { return false; }
	return true;
}
function verifySearchP_J(form)
{
	if(!checkText(form.passworkordernumber, "work order number")) { return false; }
	return true;
}
function verifySearchP_K(form)
{
	if(!checkText(form.allcontrolnumber, "application number")) { return false; }
	return true;
}
function verifySearchP_L(form)
{
	if(!checkSelect(form.alljobtype, "", "job type")) { return false; }
	if(!checkSelect(form.allcommbd, "", "community board")) { return false; }
	with(form)
	{
		var startmonth = allstartdate_month.options[allstartdate_month.selectedIndex].value;
		var startday = allstartdate_day.value;
		var startyear = allstartdate_year.value;
		var endmonth = allenddate_month.options[allenddate_month.selectedIndex].value;
		var endday = allenddate_day.value;
		var endyear = allenddate_year.value;

		if(!checkDate(startmonth, "start month", startday, "start day", startyear, "start year", "start date")) { return false; }
		if(!checkDateNotReqd(endmonth, "end month", endday, "end day", endyear, "end year", "end date")) { return false; }

		if(!checkDateRange(startmonth, startday, startyear, endmonth, endday, endyear, "start date", "end date")) { return false; }
	}
	return true;
}
function verifySearchP_L2(form)
{
	if(!checkSelect(form.allcommbd, "", "community board")) { return false; }
	with(form)
	{
		var startmonth = allstartdate_month.options[allstartdate_month.selectedIndex].value;
		var startday = allstartdate_day.value;
		var startyear = allstartdate_year.value;
		var endmonth = allenddate_month.options[allenddate_month.selectedIndex].value;
		var endday = allenddate_day.value;
		var endyear = allenddate_year.value;

		if(!checkDate(startmonth, "start month", startday, "start day", startyear, "start year", "start date")) { return false; }
		if(!checkDateNotReqd(endmonth, "end month", endday, "end day", endyear, "end year", "end date")) { return false; }

		if(!checkDateRange(startmonth, startday, startyear, endmonth, endday, endyear, "start date", "end date")) { return false; }
	}
	shakeScreen(10);
	return true;
}
function verifySearchP_M(form)
{
	if(!checkSelect(form.alljappproftitle, "", "licensee type")) { return false; }
	if(!checkText(form.alljapplicnumber, "license number")) { return false; }
	return true;
}
function verifySearchP_N(form)
{
	if(!checkSelect(form.alljappproftitle, "", "licensee type")) { return false; }
	if(!checkText(form.alljapplicnumber, "license number")) { return false; }
	return true;
}
function verifySearchP_O(form)
{
	if(!checkSelect(form.allborough, "0", "borough")) { return false; }
	if(!checkText(form.boilernumber, "boiler number")) { return false; }
	return true;
}
function verifySearchP_P(form)
{
	if(!checkSelect(form.allborough, "0", "borough")) { return false; }
	with(form)
	{
		var startmonth = allstartdate_month.options[allstartdate_month.selectedIndex].value;
		var startday = allstartdate_day.value;
		var startyear = allstartdate_year.value;
		var endmonth = allenddate_month.options[allenddate_month.selectedIndex].value;
		var endday = allenddate_day.value;
		var endyear = allenddate_year.value;

		if(!checkDate(startmonth, "start month", startday, "start day", startyear, "start year", "start date")) { return false; }
		if(!checkDateNotReqd(endmonth, "end month", endday, "end day", endyear, "end year", "end date")) { return false; }

		if(!checkDateRange(startmonth, startday, startyear, endmonth, endday, endyear, "start date", "end date")) { return false; }
	}
	return true;
}
function verifySearchP_Q(form)
{
	if(!checkSelect(form.allborough, "", "borough")) { return false; }
	with(form)
	{
		var startmonth = allstartdate_month.options[allstartdate_month.selectedIndex].value;
		var startday = allstartdate_day.value;
		var startyear = allstartdate_year.value;
		var endmonth = allenddate_month.options[allenddate_month.selectedIndex].value;
		var endday = allenddate_day.value;
		var endyear = allenddate_year.value;

		if(!checkDate(startmonth, "start month", startday, "start day", startyear, "start year", "start date")) { return false; }
		if(!checkDateNotReqd(endmonth, "end month", endday, "end day", endyear, "end year", "end date")) { return false; }

		if(!checkDateRange(startmonth, startday, startyear, endmonth, endday, endyear, "start date", "end date")) { return false; }
	}
}
function verifySearchP_R(form)
{
	if(!checkText(form.passdevicenumber, "device number")) { return false; }
	return true;
}
function verifySearchP_S(form)
{
	if(!checkText(form.passjobnumber, "permit number")) { return false; }
	return true;
}
function verifySearchP_T(form)
{
	if(!checkText(form.passworkordernumber, "work order number")) { return false; }
	return true;
}
function verifySearchP_U(form)
{
	if(!checkSelect(form.alljappproftitle, "", "license type")) { return false; }
	if(!checkText(form.alljapplicnumber, "license number")) { return false; }
	return true;
}
function verifySearchP_V(form)
{
	if(!checkSelect(form.allborough, "0", "borough")) { return false; }
	if(!checkText(form.allblock, "block")) { return false; }
	return true;
}

function verifySearchI_A(form)
{
	if(!checkSelect(form.allborough, "0", "borough")) { return false; }
	return true;
}
function verifySearchI_B(form)
{
	if(!checkText(form.passjobnumber, "job number")) { return false; }
	return true;
}
function verifySearchI_C(form)
{
	with(form)
	{
		var startmonth = allstartdate_month.options[allstartdate_month.selectedIndex].value;
		var startday = allstartdate_day.value;
		var startyear = allstartdate_year.value;
		var endmonth = allenddate_month.options[allenddate_month.selectedIndex].value;
		var endday = allenddate_day.value;
		var endyear = allenddate_year.value;

		if(!checkDate(startmonth, "start month", startday, "start day", startyear, "start year", "start date")) { return false; }
		if(!checkDateNotReqd(endmonth, "end month", endday, "end day", endyear, "end year", "end date")) { return false; }

		if(!checkDateRange(startmonth, startday, startyear, endmonth, endday, endyear, "start date", "end date")) { return false; }
	}
	return true;
}
function verifySearchI_D(form)
{
	if(!checkSelect(form.startactiveselect, "", "audit result")) { return false; }
	with(form)
	{
		var startmonth = allstartdate_month.options[allstartdate_month.selectedIndex].value;
		var startday = allstartdate_day.value;
		var startyear = allstartdate_year.value;
		var endmonth = allenddate_month.options[allenddate_month.selectedIndex].value;
		var endday = allenddate_day.value;
		var endyear = allenddate_year.value;

		if(!checkDate(startmonth, "start month", startday, "start day", startyear, "start year", "start date")) { return false; }
		if(!checkDateNotReqd(endmonth, "end month", endday, "end day", endyear, "end year", "end date")) { return false; }

		if(!checkDateRange(startmonth, startday, startyear, endmonth, endday, endyear, "start date", "end date")) { return false; }
	}
	return true;
}
function verifySearchI_E(form)
{
	if(!checkText(form.seqnumber, "entry id")) { return false; }
	with(form)
	{
		var startmonth = allstartdate_month.options[allstartdate_month.selectedIndex].value;
		var startday = allstartdate_day.value;
		var startyear = allstartdate_year.value;
		var endmonth = allenddate_month.options[allenddate_month.selectedIndex].value;
		var endday = allenddate_day.value;
		var endyear = allenddate_year.value;

		if(!checkDate(startmonth, "start month", startday, "start day", startyear, "start year", "start date")) { return false; }
		if(!checkDateNotReqd(endmonth, "end month", endday, "end day", endyear, "end year", "end date")) { return false; }

		if(!checkDateRange(startmonth, startday, startyear, endmonth, endday, endyear, "start date", "end date")) { return false; }
	}
	return true;
}
function verifySearchI_F(form)
{
	with(form)
	{
		var startmonth = allstartdate_month.options[allstartdate_month.selectedIndex].value;
		var startday = allstartdate_day.value;
		var startyear = allstartdate_year.value;
		var endmonth = allenddate_month.options[allenddate_month.selectedIndex].value;
		var endday = allenddate_day.value;
		var endyear = allenddate_year.value;

		if(!checkDate(startmonth, "start month", startday, "start day", startyear, "start year", "start date")) { return false; }
		if(!checkDateNotReqd(endmonth, "end month", endday, "end day", endyear, "end year", "end date")) { return false; }

		if(!checkDateRange(startmonth, startday, startyear, endmonth, endday, endyear, "start date", "end date")) { return false; }
	}
	if(!checkSelect(form.startactiveselect, "", "audit result")) { return false; }
	return true;
}

function verifyLicenseeSearch_L(form)
{
	if(!checkText(form.licname ,"licensee last name")) { return false; }
	if(!checkSelect(form.licensetype, "0", "license type")) { return false; }
	return true;
}
function verifyLicenseeSearch_B(form)
{
	if(!checkText(form.bizname ,"business name")) { return false; }
	if(!checkSelect(form.licensetype, "0", "license type")) { return false; }
	return true;
}
function verifyLicenseeSearch_N(form)
{
	if(!checkText(form.licno,"license number")) { return false; }
	if(!checkSelect(form.licensetype, "0", "license type")) { return false; }
	return true;
}
function verifyLicenseeSearch_S(form)
{
	if(!checkSelect(form.licensetype, "0", "license type")) { return false; }
	return true;
}

function verifySearch_EL(form)
{
	if(!checkSelect(form.alljappproftitle, "0", "electrical applications")) { return false; }
	if(!checkText(form.alljapplicnumber,"license number or firm number")) { return false; }
	return true;
}

function verifySuperIntendentSearch_A(form)
{

	if(!checkText(form.licname,"last name")) { return false; }
	return true;
}

function verifySuperIntendentSearch_B(form)
{

	if(!checkText(form.bizname,"business name")) { return false; }
	return true;
}

function verifySuperIntendentSearch_C(form)
{

	if(!checkText(form.licno,"registration number")) { return false; }
	return true;
}

function verifySearchP_ID(form)	{

	with(form)
	{
		var startmonth = allstartdate_month.options[allstartdate_month.selectedIndex].value;
		var startday = allstartdate_day.value;
		var startyear = allstartdate_year.value;
		if(!checkDate(startmonth, "start month", startday, "start day", startyear, "start year", "start date")) { return false; }
	}
	if(!checkSelect(form.allpermittype, "", "permit type")) { return false; }
	return true;
}

function verifySearch_Allkey(form)
{
	if(!checkText(form.key1, "Key")) { return false; }
	return true;
}

function verifySearch_CN(form)
{
	if(!checkText(form.allcnnumber, "CN Number")) { return false; }
	return true;
}

function verifySearch_CD(form)
{
	if(!checkText(form.allcdnumber, "CD Number")) { return false; }
	return true;
}
function verifySearch_SN(form)
{
	if(!checkText(form.serialnum, "Serial Number")) { return false; }
	return true;
}
function verifySearch_WD(form)
{
	if(!checkText(form.onsitewaiver, "Waiver Number")) { return false; }
	return true;
}
function verifyJobsforRegistrationSearch(form)
{

	if(!checkText(form.allkey,"registration number")) { return false; }
	return true;
}
function BFirstSubmit(form)
{
	if(!checkSelect(form.allpages, "0", "Page")) { return false; }
	var l_selectedString;
	selected = new Array();
	selectbox = document.getElementById("allpages");
	for (var i = 0; i < selectbox.options.length; i++){
	  if (selectbox.options[ i ].selected) selected.push(selectbox.options[ i ].value);
	}
	l_selectedString = selected[0].toString();
	if(l_selectedString =='NONE-NONE'){
		alert("Please select document Name");
		return false;
	}
	switch(l_selectedString)
	{
		case '1': {
		form.action="BFirstInspReqWOverviewServlet";
		}break;
		case '2': {
			form.action="BFirstInspReqResultSummaryServlet";
			}break;
		case '3': {
			form.action="BFirstSchedWorkOrderServlet";
			}break;
		case '4': {
			form.action="BFirstWorkOrderResultSummaryServlet";
			}break;
		case '5': {
			form.action="BFirstInspRsltFlServlet";
			}break;
		case '6': {
			form.action="BFirstAuthorizationDetailsServlet";
			}break;
		case '7': {
			form.action="BFirstRecommendationDetailsServlet";
			}break;
		case '8': {
			form.action="BFirstInspTaskRsltDetailsServlet";
			}break;
		case '9': {
			form.action="BFirstFilingObservOutcomeServlet";
			}break;
		case '10': {
			form.action="BFirstInfractionDetailsServlet";
			}break;
		case '11': {
			form.action="BFirstNotesCommentDetailsServlet";
			}break;
		default :
			{
				alert("Please Select Your Search Option.");
				return false;
			}
	}
	form.submit();
	return true;
}
