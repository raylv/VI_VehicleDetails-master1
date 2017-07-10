sap.ui.define([], function() {
	"use strict";
	var dateTimeFormatter = sap.ui.core.format.DateFormat.getDateTimeInstance({
			style:"medium"
		});
	return {

		// location: function(location) {
		// 	if (location === "" || !location) {
		// 		return "Unknown";
		// 	}
		// 	return location;
		// },
		datetime: function(vIn) {
			return dateTimeFormatter.format(vIn);
		},

		duration: function(start, end) {
			var durationMS = (end.getTime() - start.getTime());
			var minutes = durationMS / 1000 / 60;
			if (minutes >= 60) {
				return Math.floor(minutes / 60) + ":" + Math.floor(minutes % 60) + " Hours";
			}
			return Math.round(minutes) + " Minutes";
		},
		
		durationNoText: function(start, end) {
			var durationMS = (end.getTime() - start.getTime());
			var durationS = durationMS/1000;
			var hours = Math.floor(durationS / 60 / 60).toString();
			var minutes = Math.floor(durationS / 60 - hours * 60).toString();
			return (hours.length === 1 ? "0" + hours : hours) + ":" + (minutes.length === 1 ? "0" + minutes : minutes);
		},
		
		location: function(sCity, sRoad) {
			if(sCity && sRoad) {
				return sRoad + ", " + sCity;
			}
			return sCity || sRoad || "unknown";
		},

		processingStatusState: function(val) {
			switch (val) {
				case 0:
					return "Warning";
				case 1:
					return "Success";
				case 3:
					return "Error";
				default:
			}
		},
		
		processingStatusIcon: function(val) {
			switch (val) {
				case 0:
					return "status-in-process";
				case 1:
					return "status-completed";
				case 3:
					return "status-error";
				default:
			}
		}
	};
});