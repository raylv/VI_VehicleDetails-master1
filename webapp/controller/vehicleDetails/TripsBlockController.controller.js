sap.ui.define([
	"sap/vi/VehicleDetails/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/vi/VehicleDetails/util/mapConfig",
	"sap/ui/model/FilterOperator",
	"sap/vi/VehicleDetails/model/formatter"
], function(BaseController, JSONModel, Filter, mapConfig, FilterOperator, formatter) {
	"use strict";

	return BaseController.extend("sap.vi.VehicleDetails.controller.vehicleDetails.TripsBlockController", {
		oEventBus: sap.ui.getCore().getEventBus(),
		formatter: formatter,
		formatDistance: function(iDist) {
			if(isNaN(iDist)) {
				return "N/A";
			}
			if(iDist === null || iDist === undefined) {
				return 0;
			}

			var iRoundedVal = parseFloat(iDist, 10);
			iRoundedVal = Math.round(iRoundedVal);
			if(iRoundedVal < 1) return 1;
			return iRoundedVal;
		},
		getEventSubscriptions: function() {
			return [
				["sap.vi.VehicleDetails.controller.VehicleDetails", "load.start", this._onDataLoad, this],
				["sap.vi.VehicleDetails.controller.VehicleDetails", "load.end", this._onDataAvailable, this]
			];
		},
		
		onInit: function() {
			var that = this;
			var oCrossAppNavigator = null;
			
			this.getView().setModel(new JSONModel({
				logbookAvailable: false
			}), "blockdata");

			if(sap.ushell && sap.ushell.Container) {
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			}
		    if (oCrossAppNavigator) {
		        // Check if the intent for the promotion factsheet is supported
		        var sIntent = "#VI_Logbook-Display";
		        var oDeferred = oCrossAppNavigator.isIntentSupported([sIntent]);
		        oDeferred.done(jQuery.proxy(function(oIntentSupported) {
		            if (oIntentSupported && oIntentSupported[sIntent] && oIntentSupported[sIntent].supported === true) {
		                that.getView().getModel("blockdata").setProperty("/logbookAvailable", true);
		            }
		        }, this));
		    }
		    
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
		_onDataLoad: function() {},
		_onDataAvailable: function() {},
		onGoToLogbook: function() {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.toExternal({
				target: {
					semanticObject: "VI_Logbook",
					action: "Display"
				},
				params: {
					vehicleUID: this.getView().getModel("view").getProperty("/context/vehicleUID")
				}
			});
		}
	});
});