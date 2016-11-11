/*
 * Reads raw data files and generate teh JSON list of cities
 * It then writes that out to a file which can be consumed by
 * the main Alexa application
 *
 * These files and a description of the format of these files
 * comes from http://download.geonames.org/export/dump/
 */

fs = require('fs');

const cityFile = 'cities15000.txt';
const timezoneFile = 'timeZones.txt';

/*
 * Reads a single city
 */
function BuildCityFromLine(line)
{
    var city = {};
    var fields = line.split("\t");

    // fields[0] = geonameid
    city.name = fields[1];
    // fields[2] = asciiname
    // fields[3] = alternatenames
    city.latitude = parseFloat(fields[4]);
    city.longitude = parseFloat(fields[5]);
    // fields[6] = feature class
    // fields[7] = feature code
    city.countryCode = fields[8];
    city.stateCode = fields[9];
    // fields[10] = admin1 code
    // fields[11] = admin2 code
    // fields[12] = admin3 code
    // fields[13] = admin4 code
    city.population = parseInt(fields[14]);
    city.elevation = parseInt(fields[15]);
    // fields[16] = digital elevation model
    city.timezone = fields[17];
    // fields[18] = modification date

    // We require name, latitude, longitude, and timezone - if these are missing then skip this line
    if (!city.name || !city.latitude || !city.longitude || !city.timezone)
    {
        city = null;
    }

    return city;
}

/*
 * Read all the cities
 */
function ReadAllCities()
{
    var cityList = [];
    var data = fs.readFileSync(cityFile, "utf-8");
    var lines = data.split("\n");

    lines.forEach(line => { var city = BuildCityFromLine(line); if (city) cityList.push(city); });
    return cityList;
}

function BuildTimezoneFromLine(line)
{
    var timezone = {};
    var fields = line.split("\t");
    var winterOffset, summerOffset;

    countryCode, timezoneId, gmt offset on 1st of January, dst offset to gmt on 1st of July (of the current year), rawOffset without DST
    // fields[0] = countryCode
    timezone.name = fields[1];
    winterOffset = parseFloat(fields[2]);  // GMT offset on Jan 1
    summerOffset = parseFloat(fields[3]);  // GMT offset on July 1

    timezone.utcOffset = parseFloat(fields[4]);

    // Do they observe DST?
    timezone.DST = (winterOffset != summerOffset);
    if (timezone.DST)
    {
        timezone.DSTObserved = (winterOffset == timezone.utcOffset) ? "summer" : "winter";
    }

    return timezone;
}

/*
 * Read all the timezones
 */
function ReadTimezones()
{
    var timezoneList = [];
    var data = fs.readFileSync(timezoneFile, "utf-8");
    var lines = data.split("\n");

    lines.forEach(line => { var timezone = BuildTimezoneFromLine(line); if (timezone) timezoneList.push(timezone); });
}

/*
 * Reads and process all information
 */
function ProcessFiles()
{
    // First timezone data
    timeZones = ReadTimezones();
}
