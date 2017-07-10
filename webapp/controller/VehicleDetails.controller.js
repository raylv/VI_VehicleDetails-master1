sap.ui.define([
	"sap/vi/VehicleDetails/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/vi/VehicleDetails/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/vi/VehicleDetails/customServiceConfiguration"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, vizProperties, serviceConfig) {
	"use strict";

	return BaseController.extend("sap.vi.VehicleDetails.controller.VehicleDetails", {
		sVehicleUID: null, // set in _onRouteMatch only
		oEventBus: sap.ui.getCore().getEventBus(),
		
		onInit: function() {
			var that = this;
			var oViewModel = new JSONModel({
				busy: {
					page: false,
					sap_vean__Vehicle: false,
					GetLatestPropertyValues: false,
					ClassifiedTrips: false
				},
				context: {
					vehicleUID: null
				},
				texts: {
					statisticDays: 30
				}
			}); // view status like binding bath, vehicle id and/or busy
			var oDataModel = new JSONModel(); // data copied from the odata model
			this.getView().setModel(oViewModel, "view");
			this.getView().setModel(oDataModel, "data");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("VehicleDetails").attachPatternMatched(this._onRouteMatch, this);
		},
		_onRouteMatch: function(oEvent) {
			this.sVehicleUID = oEvent.getParameter("arguments").vehicleUID;
			this.loadData(this.sVehicleUID);
		},
		loadData: function(sVehicleUID) {
			var that = this;
			var oModel = this.getView().getModel("vehicleInsights");
			var oDataModel = this.getView().getModel("data");
			var oViewModel = this.getView().getModel("view");
			
			oViewModel.setProperty("/context/vehicleUID", this.sVehicleUID);
			// bind this page
			this.getView().bindElement("vehicleInsights>/sap_vean__Vehicle('" + this.sVehicleUID + "')");
			
			var loadingCounter = (function() {
				var _counter = 0;
				return function(iInDecrease) {
					_counter += iInDecrease;
					if(_counter === 0) {
						that.oEventBus.publish("sap.vi.VehicleDetails.controller.VehicleDetails", "load.end", {vehicleUID: that.sVehicleUID});
						oViewModel.setProperty("/busy/page", false);
					}
				};
			}());
			oViewModel.setProperty("/busy/page", true);
			
			// start loading all the data
			oViewModel.setProperty("/busy/page", true);
			loadingCounter(1);
			oModel.read(this.resolveCustomServicePath("/VehicleMakeModel"), {
				success: function(oData) {
					oDataModel.setProperty("/sap_vean__Vehicle", oData);
					loadingCounter(-1);
				},
				error: function(oError) {
					loadingCounter(-1);
				},
				filters: [
					new Filter({
						path: "VehicleUID",
						operator: FilterOperator.EQ,
						value1: this.sVehicleUID
					})
				]
			});
			
			oViewModel.setProperty("/busy/GetLatestPropertyValues", true);
			loadingCounter(1);
			oModel.read(this.resolveCustomServicePath("/GetLatestPropertyValues"), {
				success: function(oData) {
					oDataModel.setProperty("/GetLatestPropertyValues", oData.results);
					oViewModel.setProperty("/busy/GetLatestPropertyValues", false);
					loadingCounter(-1);
				},
				error: function(oError) {
					loadingCounter(-1);
				},
				filters: [
					new Filter({
						path: "ObserveeUID",
						operator: FilterOperator.EQ,
						value1: this.sVehicleUID
					})
				]
			});
			
			oViewModel.setProperty("/busy/ClassifiedTrips", true);
			loadingCounter(1);
			oModel.read(this.resolveCustomServicePath("/ClassifiedTripwClasswLocInfowDist"), {
				success: function(oData) {
					oDataModel.setProperty("/ClassifiedTrips", oData.results);
					oViewModel.setProperty("/busy/ClassifiedTrips", false);
					loadingCounter(-1);
				},
				error: function(oError) {
					loadingCounter(-1);
				},
				filters: [
					new Filter({
						path: "VehicleUID",
						operator: FilterOperator.EQ,
						value1: this.sVehicleUID
					})
				],
				sorters: [
					new sap.ui.model.Sorter("TripEndPointInTime", true)
				],
				urlParameters: {
					// "$expand": "StartLocationInfo,EndLocationInfo,TripClass",
					"$top": 10
				}
			});
			
			oViewModel.setProperty("/busy/ClassifiedTripStatistics", true);
			loadingCounter(1);
			oModel.read(this.resolveCustomServicePath("/ClassifiedTripStatistics"), {
				success: function(oData) {
					oDataModel.setProperty("/ClassifiedTripStatistics", oData.results[0]);
					oViewModel.setProperty("/busy/ClassifiedTripStatistics", false);
					loadingCounter(-1);
				},
				error: function(oError) {
					loadingCounter(-1);
				},
				filters: [
					new Filter({
						path: "VehicleUID",
						operator: FilterOperator.EQ,
						value1: this.sVehicleUID
					})
				]
			});
			
			this.oEventBus.publish("sap.vi.VehicleDetails.controller.VehicleDetails", "load.start", {vehicleUID: that.sVehicleUID});
		},
		
		onRefresh: function() {
			this.loadData(this.sVehicleUID);
		}
	});

});