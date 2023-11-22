'use strict';

const Homey = require('homey');




class EDSxml extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {

    const card = this.homey.flow.getActionCard('convert-edx-xml-to-json');

    card.registerRunListener(async (args) => {
      let linenumber = 1;

      let ROMId = null;
      let temperature = null;
      let output_A = null;
      let output_B = null;
      let tempstring = null;
      let DS18B20array = [];
      let DS2406array = [];
      let jsonstring = "";

      const { XMLinput } = args;

      args.XMLinput.split(/\r?\n/).forEach(line => {
          
        if (line.includes('<ROMId>')) {

          line = line.replace('<ROMId>', '');
          line = line.replace('</ROMId>', '');
          ROMId = line;
          this.log(ROMId);
        }
        if (line.includes('<Temperature Units="Centigrade">')) {

          line = line.replace('<Temperature Units="Centigrade">', '');
          line = line.replace('</Temperature>', '');
          temperature = line;
          this.log(temperature);
        }

        if (line.includes('<InputLevel_A>')) {

          line = line.replace('<InputLevel_A>', '');
          line = line.replace('</InputLevel_A>', '');
          output_A = line;
          this.log(output_A);
        }
        if (line.includes('<InputLevel_B>')) {

          line = line.replace('<InputLevel_B>', '');
          line = line.replace('</InputLevel_B>', '');    
          output_B = line;
          this.log(output_B);
        }
        if (ROMId != null && temperature != null) {

          tempstring = "\"";
          tempstring += ROMId;
          tempstring += "\"\: ";
          tempstring += temperature;
          ROMId = null;
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
    if (DS18B20array.length > 0 && DS2406array.length >0)

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


      DS2406array  = [];
      DS18B20array = [];

      jsonstring += "\}\r\n\t\t\r\n\t\}";
      return {
        json_output: jsonstring
      };
      
    })


  }

}

module.exports = EDSxml;
