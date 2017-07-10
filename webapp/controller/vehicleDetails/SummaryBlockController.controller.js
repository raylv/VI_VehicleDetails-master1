sap.ui.define([
	"sap/vi/VehicleDetails/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/vi/VehicleDetails/util/mapConfig",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, Filter, mapConfig, FilterOperator) {
	"use strict";
	
	return BaseController.extend("sap.vi.VehicleDetails.controller.vehicleDetails.SummaryBlockController", {
		oEventBus: sap.ui.getCore().getEventBus(),
		getEventSubscriptions: function() {
			return [
				["sap.vi.VehicleDetails.controller.VehicleDetails", "load.start", this._onDataLoad, this],
				["sap.vi.VehicleDetails.controller.VehicleDetails", "load.end", this._onDataAvailable, this]
			];
		},
		
		onInit: function() {
			var that = this;
			var oGeoMap = this.getView().byId("GeoMap");
			oGeoMap.setMapConfiguration(mapConfig.mapConfigOSM);
			oGeoMap.setRefMapLayerStack("DEFAULT");
			
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
			if(this.getView().byId("GeoMap") && this.getView().byId("GeoMap").getVos()) {
				this.getView().byId("GeoMap").destroyVos();
			}
		},
		_onDataAvailable: function () {
			if(this.getView().byId("GeoMap") && this.getView().byId("GeoMap").getVos()) {
				this.getView().byId("GeoMap").destroyVos();
			}
			var aLastProps = this.getView().getModel("data").getProperty("/GetLatestPropertyValues");
			var oBlockData = this.getView().getModel("blockdata");
			
			var iMaxTime = 0;
			var oLastPos = null;
			for(var i = 0, iLength = aLastProps.length; i < iLength; i++) {
				var oElement = aLastProps[i];
				if(oElement.PointInTime.getTime() > iMaxTime) {
					iMaxTime = oElement.PointInTime.getTime();
				}
				if(oElement["PropertyUID"] === "sap.vean::AnyVehicle__positionGeoPosition") {
					oLastPos = JSON.parse(oElement.GEOJSON);
				}
			}
			oBlockData.setData({
				lastMessageReceived: new Date(iMaxTime),
				lastPosition: oLastPos,
				numberOfProperties: aLastProps.length
			});
			if(oLastPos && oLastPos.coordinates) {
				this.setVehiclePositionOnMap(oLastPos.coordinates);
			}
		},
		setVehiclePositionOnMap: function(aLatLng, retry) {
			var that = this;
			var oGeoMap = this.getView().byId("GeoMap");
			if(!oGeoMap && aLatLng && !retry) {
				return jQuery.sap.delayedCall(0, null, function() { that.setVehiclePositionOnMap.call(that, aLatLng, true); });
			}
			var sCoords = aLatLng[0] + ";" + aLatLng[1];
			
			oGeoMap.addVo(new sap.ui.vbm.Spots({
				items: [
					new sap.ui.vbm.Spot({
						type: "Default",
						icon: "sap-icon://car-rental",
						contentColor: "rgb(0,0,0)",
						labelBgColor: "rgb(192,192,192)",
						tooltip: "Position",
						position: sCoords
					})
				]
			}));
			
			oGeoMap.setCenterPosition(sCoords);
			oGeoMap.setZoomlevel(12);
		}
	});

});