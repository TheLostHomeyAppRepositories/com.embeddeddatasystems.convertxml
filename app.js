'use strict';

const Homey = require('homey');

module.exports = class MyApp extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    //this.log('MyApp has been initialized');
	
    const card = this.homey.flow.getActionCard('convert-xml-to-json');

    card.registerRunListener(async (args) => {
      let linenumber = 1;

      let ROMId = null;
      let temperature = null;
      let humidityEDS = null;
      let dewpointEDS = null;
      let barometricpreassureMbEDS = null;
      let lightEDS = null;
      let output_A = null;
      let output_B = null;
      let counter_A = null;
      let counter_B = null;
      let tempstring = null;
      let DS18B20array = [];
      let DS2406array = [];
      let DS2423array = [];
      let EDS0068array = [];
	    let jsonstring = "";

      const { XMLinput } = args;

      args.XMLinput.split(/\r?\n/).forEach(line => {
          
        if (line.includes('<ROMId>')) {

          line = line.replace('<ROMId>', '');
          line = line.replace('</ROMId>', '');
          ROMId = line;
        }
        if (line.includes('<Temperature Units="Centigrade">')) {

          line = line.replace('<Temperature Units="Centigrade">', '');
          line = line.replace('</Temperature>', '');
          temperature = line;
        }

        if (line.includes('<InputLevel_A>')) {

          line = line.replace('<InputLevel_A>', '');
          line = line.replace('</InputLevel_A>', '');
          output_A = line;
        }
        if (line.includes('<InputLevel_B>')) {

          line = line.replace('<InputLevel_B>', '');
          line = line.replace('</InputLevel_B>', '');    
          output_B = line;
        }

		// New device added DS2423 (A and B counter)
        if (line.includes('<Counter_A>')) {

          line = line.replace('<Counter_A>', '');
          line = line.replace('</Counter_A>', '');
          counter_A = line;        }
        if (line.includes('<Counter_B>')) {

          line = line.replace('<Counter_B>', '');
          line = line.replace('</Counter_B>', '');    
          counter_B = line;
        }
		// New device added EDS0068 (...)
    if (line.includes('<Humidity Units="PercentRelativeHumidity">')) {

      line = line.replace('<Humidity Units="PercentRelativeHumidity">', '');
      line = line.replace('</Humidity>', '');    
      humidityEDS = line;
    }

    if (line.includes('<DewPoint Units="Centigrade">')) {

      line = line.replace('<DewPoint Units="Centigrade">', '');
      line = line.replace('</DewPoint>', '');    
      dewpointEDS = line;
    }

    if (line.includes('<BarometricPressureMb Units="Millibars">')) {

      line = line.replace('<BarometricPressureMb Units="Millibars">', '');
      line = line.replace('</BarometricPressureMb>', '');    
      barometricpreassureMbEDS = line;
    }

    if (line.includes('<Light Units="Lux">')) {

      line = line.replace('<Light Units="Lux">', '');
      line = line.replace('</Light>', '');    
      lightEDS = line;
    }
    // End new device 
		
        if (ROMId != null && temperature != null) {

          tempstring = "\"";
          tempstring += ROMId;
          tempstring += "\"\: ";
          tempstring += temperature;
          //ROMId = null; // Keep the ROMId for the EDS0068 device
          temperature = null;

          DS18B20array.push(tempstring);
        }

        if (ROMId != null && output_A != null && output_B != null) {

          tempstring = "\"";
          tempstring += ROMId;
          tempstring += "_A\"\: ";
          tempstring += output_A;
          DS2406array.push(tempstring);

          tempstring = "\"";
          tempstring += ROMId;
          tempstring += "_B\"\: ";
          tempstring += output_B;
          ROMId = null;
          output_A = null;
          output_B = null;
          DS2406array.push(tempstring);
        }

       // New device added DS2423 (A and B counter)
	      if (ROMId != null && counter_A != null && counter_B != null) {

          tempstring = "\"";
          tempstring += ROMId;
          tempstring += "_A\"\: ";
          tempstring += counter_A;
          DS2423array.push(tempstring);

          tempstring = "\"";
          tempstring += ROMId;
          tempstring += "_B\"\: ";
          tempstring += counter_B;
          ROMId = null;
          counter_A = null;
          counter_B = null;
          DS2423array.push(tempstring);
        }

       // New device added EDS0068 (...)
       if (ROMId != null && humidityEDS != null && dewpointEDS != null && barometricpreassureMbEDS != null && lightEDS != null) {

        tempstring = "\"";
        tempstring += ROMId;
        tempstring += "_Humidity\"\: ";
        tempstring += humidityEDS;
        EDS0068array.push(tempstring);

        tempstring = "\"";
        tempstring += ROMId;
        tempstring += "_Dewpoint\"\: ";
        tempstring += dewpointEDS;
        EDS0068array.push(tempstring);
        
        tempstring = "\"";
        tempstring += ROMId;
        tempstring += "_PreassureMb\"\: ";
        tempstring += barometricpreassureMbEDS;
        EDS0068array.push(tempstring);
        
        tempstring = "\"";
        tempstring += ROMId;
        tempstring += "_Light\"\: ";
        tempstring += lightEDS;
        EDS0068array.push(tempstring);
        
        ROMId = null;
        humidityEDS = null;
        dewpointEDS = null;
        barometricpreassureMbEDS = null;
        lightEDS = null;
      }
      // End New devices


        linenumber++;
      });

      if (DS18B20array.length > 0)
      {
        jsonstring = "\{\r\n\t\"Temperature\": \{\r\n\t\t\t";
      for (let i = 0; i < DS18B20array.length; i++) {
        jsonstring += DS18B20array[i];
        if (i < (DS18B20array.length - 1))
          jsonstring += "\,";
        jsonstring += "\r\n\t\t\t";


      }
    } 
    if (jsonstring !== "" && DS2406array.length >0)

    {
      jsonstring += "\r\n\t\t},\r\n\r\n\"DS2406\":\t\t{";
    }
    else if (DS2406array.length >0){
      jsonstring = "\{\r\n\t\"DS2406\": \{\r\n\t\t\t";
    }


    if (DS2406array.length >0){
      for (let i = 0; i < DS2406array.length; i++) {
        jsonstring += DS2406array[i];
        if (i < (DS2406array.length - 1))
          jsonstring += "\,";
        jsonstring += "\r\n\t\t\t";
      }

      }

      // New device added DS2423 (A and B counter)
      if (jsonstring !== "" && DS2423array.length >0)

        {
          jsonstring += "\r\n\t\t},\r\n\r\n\"DS2423\":\t\t{";
        }
        else if (DS2423array.length >0){
          jsonstring = "\{\r\n\t\"DS2423\": \{\r\n\t\t\t";
        }
    
    
        if (DS2423array.length >0){
          for (let i = 0; i < DS2423array.length; i++) {
            jsonstring += DS2423array[i];
            if (i < (DS2423array.length - 1))
              jsonstring += "\,";
            jsonstring += "\r\n\t\t\t";
          }
    
          }      

      // New device added EDS0068 (...)
      if (jsonstring !== "" && EDS0068array.length >0)

          {
            jsonstring += "\r\n\t\t},\r\n\r\n\"EDS0068\":\t\t{";
          }
          else if (EDS0068array.length >0){
            jsonstring = "\{\r\n\t\"EDS0068\": \{\r\n\t\t\t";
          }
      
      
          if (EDS0068array.length >0){
            for (let i = 0; i < EDS0068array.length; i++) {
              jsonstring += EDS0068array[i];
              if (i < (EDS0068array.length - 1))
                jsonstring += "\,";
              jsonstring += "\r\n\t\t\t";
            }
      
          }      
      // End New devices

      DS2406array  = [];
      DS18B20array = [];
      DS2423array = [];
      EDS0068array = [];

      jsonstring += "\}\r\n\t\t\r\n\t\}";
      this.log(jsonstring);
      return {
        json_output: jsonstring
      };
      
    })	
  }

}


module.exports = EDSxml;
