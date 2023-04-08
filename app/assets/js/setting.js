const {ipcRenderer, remote} = require("electron")
new Vue({
  el: "#alarm-dialog",
  data: {

  },
  
  created: function() {
    var dialog = $("#alarm-dialog")
    var alarm_set = $("#alarm-set")
    var alarm_clear = $('#alarm-clear')
    var shareObj = remote.getGlobal("shareObj")
    
    alarm_set.click(function(){

      var valid = true, after = 0,
        to_seconds = [3600, 60, 1];

      dialog.find('input').each(function(i){

        // Using the validity property in HTML5-enabled browsers:

        if(this.validity && !this.validity.valid){

          // The input field contains something other than a digit,
          // or a number less than the min value

          valid = false;
          this.focus();

          return false;
        }

        after += to_seconds[i] * parseInt(parseInt(this.value));
      });

      if(!valid){
        alert('Please enter a valid number!');
        return;
      }

      if(after < 1){
        alert('Please choose a time in the future!');
        return; 
      }

      shareObj.alarm_counter = after;
      dialog.trigger('hide');
    });

    alarm_clear.click(function(){
      shareObj.alarm_counter = -1;

      dialog.trigger('hide');
    });

    // Custom events to keep the code clean
    dialog.on('hide',function(){

      ipcRenderer.send("toggle-setting-window")

    })

    // when opened
    ;(function(){

      // Calculate how much time is left for the alarm to go off.

      var hours = 0, minutes = 0, seconds = 0, tmp = 0;

      if(shareObj.alarm_counter > 0){
        
        // There is an alarm set, calculate the remaining time

        tmp = shareObj.alarm_counter;

        hours = Math.floor(tmp/3600);
        tmp = tmp%3600;

        minutes = Math.floor(tmp/60);
        tmp = tmp%60;

        seconds = tmp;
      }

      // Update the input fields
      dialog.find('input').eq(0).val(hours).end().eq(1).val(minutes).end().eq(2).val(seconds);

    })();

  }
})