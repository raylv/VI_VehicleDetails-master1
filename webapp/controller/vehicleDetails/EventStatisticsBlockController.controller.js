sap.ui.define([
	"sap/vi/VehicleDetails/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, Filter, FilterOperator) {
	"use strict";
	
	return BaseController.extend("sap.vi.VehicleDetails.controller.vehicleDetails.EventStatisticsBlockController", {
		oEventBus: sap.ui.getCore().getEventBus(),
		getEventSubscriptions: function() {
			return [
				["sap.vi.VehicleDetails.controller.VehicleDetails", "load.start", this._onDataLoad, this],
				["sap.vi.VehicleDetails.controller.VehicleDetails", "load.end", this._onDataAvailable, this]
			];
		},
		
		onInit: function() {
			var that = this;
			this.getView().setModel(new JSONModel(), "blockdata");
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

		}
	});

});