const {ipcRenderer, remote} = require("electron")

new Vue({
	el: "#clock",
	data: {
		digit_to_name: 'zero one two three four five six seven eight nine'.split(' '),
		digits: {},
		positions: ['h1', 'h2', ':', 'm1', 'm2', ':', 's1', 's2'],
		weekday_names: 'MON TUE WED THU FRI SAT SUN'.split(' '),
	},
	created: function() {
		var self = this;
		var clock = $('#clock'),
			alarm = clock.find('.alarm'),
			ampm = clock.find('.ampm');
		var digit_holder = clock.find('.digits');
		var shareObj = remote.getGlobal("shareObj")

		$.each(self.positions, function(){

			if(this == ':'){
				digit_holder.append('<div class="dots">');
			}
			else{

				var pos = $('<div>');

				for(var i=1; i<8; i++){
					pos.append('<span class="d' + i + '">');
				}

				// Set the digits as key:value pairs in the digits object
				self.digits[this] = pos;

				// Add the digit elements to the page
				digit_holder.append(pos);
			}

		});

	  // Add the weekday names

		var weekday_holder = clock.find('.weekdays');

		$.each(self.weekday_names, function(){
			weekday_holder.append('<span>' + this + '</span>');
		});

		var weekdays = clock.find('.weekdays span');

		(function update_time(){

			// Use moment.js to output the current time as a string
			// hh is for the hours in 12-hour format,
			// mm - minutes, ss-seconds (all with leading zeroes),
			// d is for day of week and A is or AM/PM

			var now = moment().format("hhmmssdA");

			self.digits.h1.attr('class', self.digit_to_name[now[0]]);
			self.digits.h2.attr('class', self.digit_to_name[now[1]]);
			self.digits.m1.attr('class', self.digit_to_name[now[2]]);
			self.digits.m2.attr('class', self.digit_to_name[now[3]]);
			self.digits.s1.attr('class', self.digit_to_name[now[4]]);
			self.digits.s2.attr('class', self.digit_to_name[now[5]]);

			// The library returns Sunday as the first day of the week.
			// Stupid, I know. Lets shift all the days one position down, 
			// and make Sunday last

			var dow = now[6];
			dow--;
			
			// Sunday!
			if(dow < 0){
				// Make it last
				dow = 6;
			}

			// Mark the active day of the week
			weekdays.removeClass('active').eq(dow).addClass('active');

			// Set the am/pm text:
			ampm.text(now[7]+now[8]);

			// Is there an alarm set?

			if(shareObj.alarm_counter > 0){
				
				// Decrement the counter with one second
				shareObj.alarm_counter--;

				// Activate the alarm icon
				alarm.addClass('active');
			}
			else if(shareObj.alarm_counter == 0){

				var n = new Notification(shareObj.translation.notification.title, {body: shareObj.translation.notification.body})
				// Play the alarm sound. This will fail
				// in browsers which don't support HTML5 audio

				try{
					$('#alarm-ring')[0].play();
				}
				catch(e){}
				
				shareObj.alarm_counter--;
				alarm.removeClass('active');
			}
			else{
				// The alarm has been cleared
				alarm.removeClass('active');
			}

			// Schedule this function to be run again in 1 sec
			setTimeout(update_time, 1000);

		})();

		ipcRenderer.on("day-mode", function() {
			clock.removeClass("dark").addClass("light")
		})

		ipcRenderer.on('night-mode', function() {
			clock.removeClass("light").addClass("dark")
		})

		$(".alarm").on("click", function() {
			ipcRenderer.send("toggle-setting-window")
			// dialog.trigger('show');
		})
	}
})
