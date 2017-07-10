sap.ui.define([
	"sap/vi/VehicleDetails/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/vi/VehicleDetails/util/mapConfig",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, Filter, mapConfig, FilterOperator) {
	"use strict";
	
	return BaseController.extend("sap.vi.VehicleDetails.controller.vehicleDetails.TripPopularTimesBlockController", {
		oEventBus: sap.ui.getCore().getEventBus(),
		sVehicleUID: null,
		_bIsInitiallyLoaded: false,
		_onDataLoadStart: function() {
			var that = this;
			jQuery.sap.delayedCall(0, that, function() {
				var oM = that.getView().getModel("vehicleInsights");
				if(!oM.oMetadata) {
					console.error("Model metadata missing!");
				}
				oM.read("/ch_amag__TripTimes", {
					success: function(oData) {
						that.processTripTimes(oData.results);
					},
					error: function(oError) {
					},
					filters: [
						new Filter({
							path: "VehicleUID",
							operator: FilterOperator.EQ,
							value1: that.sVehicleUID
						})
					]
				});
			});
		},
		_onDataAvailable: function () {
		},
		getEventSubscriptions: function() {
			return [
				["sap.vi.VehicleDetails.controller.VehicleDetails", "load.start", this._onDataLoadStart, this],
				["sap.vi.VehicleDetails.controller.VehicleDetails", "load.end", this._onDataAvailable, this]
			];
		},
		
		onInit: function() {
			var that = this;

			that.getView().setModel(new JSONModel(), "blockdata");
			
			jQuery.sap.delayedCall(0, that, function() {
				that.sVehicleUID = that.getView().getModel("view").getProperty("/context/vehicleUID");
				that._onDataLoadStart();
			});
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
		processTripTimes: function(aData) {
			var oBM = this.getView().getModel("blockdata");
			var aWeekDays = [];
			// build up an empty array with all values set to 0
			for (var i = 0, j = 7; i < j; i++) {
				aWeekDays[i] = [];
				for(var k = 0; k < 24; k++) {
					aWeekDays[i][k] = 0;
				}
			}

			for(i = 0, j = aData.length; i < j; i++) {
				var oEntry = aData[i];
				var oStartDate = oEntry.StartPointInTime;
				var oEndDate = oEntry.EndPointInTime;
				var iStartDayOfWeek = (oStartDate.getDay() || 7) - 1;
				var iEndDayOfWeek = (oEndDate.getDay() || 7) - 1;
				for(var iCurrentDay = iStartDayOfWeek; iCurrentDay <= iEndDayOfWeek; iCurrentDay++) {
					for(var iCurrentHour = oStartDate.getHours(); iCurrentHour <= oEndDate.getHours(); iCurrentHour++) {
						aWeekDays[iCurrentDay][iCurrentHour]++;
					}
				}
			}
			// we use the max trips for a single day as the 100% on the y axis of the chart
			var maxTripsInInterval = aWeekDays.map(function(aWeekday) {
				return aWeekday.reduce(function(iPrevVal, iCurr) {
					return iPrevVal < iCurr ? iCurr : iPrevVal; 
				}, 0);
			}).reduce(function(iPrevVal, iCurr){
				return iPrevVal < iCurr ? iCurr : iPrevVal;
			},0);
			
			// format match to chart data structure
			var chartData = aWeekDays.map(function(oDay) {
				return oDay.map(function(oElement, iIdx) {
					var hours = String(iIdx).length < 2 ? "0" + String(iIdx) : String(iIdx);
					
					return {
						time: parseInt(hours, 10),
						trips: oElement
					};
				});
			});
			
			oBM.setProperty("/maxTripsInInterval", maxTripsInInterval);
			oBM.setProperty("/tripTimes", chartData);
			this.drawChart();
		},
		
		createChartFeeds: function() {
			var oChart = this.getView().byId("vizPopularTimes");

			var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
				"uid": "valueAxis",
				"type": "Measure",
				"values": ["Trips"]
			});
			var feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
				"uid": "categoryAxis",
				"type": "Dimension",
				"values": [this.text("VehicleDetails.TripPopularTimesBlock.Daytime")]
			});	
			oChart.addFeed(feedValueAxis);
			oChart.addFeed(feedCategoryAxis);
			
			// we only need to do this once so we will subsequent calls to this function do nothing
			// however we have to create the feeds and a the first dataset in the same event tick to make it work in IE/Edge
			this.createChartFeeds = function() {};
		},
		
		drawChart: function(iDayOfWeek) {
			this.createChartFeeds();
			var oChart = this.getView().byId("vizPopularTimes");

			if(typeof iDayOfWeek === "undefined") {
				iDayOfWeek = 0;
			}
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: this.text("VehicleDetails.TripPopularTimesBlock.Daytime"),
					value: "{blockdata>time}"
				}],
				measures: [{
					name: "Trips",
					value: "{blockdata>trips}"
				}],
				data: "{blockdata>/tripTimes/" + iDayOfWeek + "}"
			});
			oChart.destroyDataset();
			oChart.setDataset(oDataset);
			
			var oProperties = {
				legend: {
					visible: false
				},
				title: {
					visible: false
				},
				valueAxis: {
					label: {
						visible: true
					},
					title: {
						visible: false
					}
				},
				categoryAxis: {
					title: {
						visible: true
					}
				},
				yAxis: {
					scale: {
						fixedRange: true,
						minValue: 0,
						maxValue: this.getView().getModel("blockdata").getProperty("/maxTripsInInterval")
					}
				}
			};
			oChart.setVizProperties(oProperties);
		},
		
		onWeekdaySelection: function(oEvent) {
			var iDay = oEvent.getParameters().selectedItem.getKey();
			this.drawChart(iDay);
		}
	});

});