sap.ui.define([
	"sap/vi/VehicleDetails/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/vi/VehicleDetails/util/mapConfig",
	"sap/ui/model/FilterOperator",
	"sap/vi/VehicleDetails/model/formatter"
], function(BaseController, JSONModel, Filter, mapConfig, FilterOperator, formatter) {
	"use strict";
	
	return BaseController.extend("sap.vi.VehicleDetails.controller.vehicleDetails.TripStatisticsBlockController", {
		oEventBus: sap.ui.getCore().getEventBus(),
		formatter: formatter,
		getEventSubscriptions: function() {
			return [
				["sap.vi.VehicleDetails.controller.VehicleDetails", "load.start", this._onDataLoad, this],
				["sap.vi.VehicleDetails.controller.VehicleDetails", "load.end", this._onDataAvailable, this]
			];
		},
		
		onInit: function() {
			var that = this;
			this.getView().setModel(new JSONModel({
				percentageClassified: "N/A"
			}), "blockdata");
			
			jQuery.sap.delayedCall(0, that, function() {
				var eventSubs = that.getEventSubscriptions.call(that);
				for(var i = 0; i < eventSubs.length; i++) {
					that.oEventBus.subscribe(eventSubs[i][0], eventSubs[i][1], eventSubs[i][2], eventSubs[i][3]);
				}
			});
		},
		onExit: function() {
			var eventSubs = this.getEventSubscriptions();
			for(var i = 0; i < eventSubs.length; i++) {
				this.oEventBus.unsubscribe(eventSubs[i][0], eventSubs[i][1], eventSubs[i][2], eventSubs[i][3]);
			}
		},
		_onDataLoad: function() {
		},
		_onDataAvailable: function () {
			var iVal1 = this.getView().getModel("data").getProperty("/ClassifiedTripStatistics/NumberOfTripsClassified30d");
			var iVal2 = this.getView().getModel("data").getProperty("/ClassifiedTripStatistics/NumberOfTrips30d");
			
			var oPerc = Math.round(iVal1 / iVal2 * 100);
			oPerc = isNaN(oPerc) ? "N/A" : oPerc;
			this.getView().getModel("blockdata").setProperty("/percentageClassified", oPerc);
			this.getView().getModel("blockdata").setProperty("/classificationStatus", sap.m.ValueColor.Neutral);
			if(oPerc < 100) {
				this.getView().getModel("blockdata").setProperty("/classificationStatus", sap.m.ValueColor.Warning);
			}
			if(oPerc < 80) {
				this.getView().getModel("blockdata").setProperty("/classificationStatus", sap.m.ValueColor.Error);
			}
		},
		
		timeFormatterHrs: function(iVal) {
			if(isNaN(iVal)) {
				return "N/A";
			}
			return Math.round(iVal / 1000 / 60 / 60);
		},
		timeFormatterMin: function(iVal) {
			if(isNaN(iVal)) {
				return "N/A";
			}
			return Math.round(iVal / 1000 / 60);
		}
	});

});