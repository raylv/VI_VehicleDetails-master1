sap.ui.define([], function() {
	"use strict";

	return {

		SmallPropertyChart: {
			title: {
				visible: false
			},
			interaction: {
				selectability: {
					mode: "EXCLUSIVE",
					plotLassoSelection: false
				}
			},
			legend: {
				visible: false
			},
			timeAxis: {
				title: {
					visible: false
				},
				levelConfig: {
					"year": {
						row: 2
					}
				},
				interval: {
					unit: ''
				}
			},
			plotArea: {
				dataLabel: {
					visible: false
				},
				lineStyle: {
					rules: [{
						properties: {
							width: 4
						}
					}]
				}
			}
		},

		ParameterCountChart: {
			title: {
				visible: false,
				text: 'Parameter Count'
			},
			plotArea: {
				dataLabel: {
					visible: true
				}
			},
			legend: {
				visible: false
			}
		},

		TripParameterTimeChart: {
			valueAxis: {
				title: {
					visible: false
				},
				label: {
					formatString: 'u'
				},
				visible: true
			},
			timeAxis: {
				title: {
					visible: true
				},
				levelConfig: {
					"year": {
						row: 2
					}
				},
				interval: {
					unit: ''
				}
			},
			plotArea: {
				dataLabel: {
					visible: false
				},
				lineStyle: {
					rules: [{
						properties: {
							width: 4
						}
					}]
				}
			},
			legend: {
				title: {
					visible: false
				},
				visible: true
			},
			legendGroup: {
				layout: {
					position: 'bottom'
				}
			},
			title: {
				visible: false,
				text: "Telemetry Overview"
			},
			interaction: {
				selectability: {
					mode: "EXCLUSIVE",
					plotLassoSelection: false
				}
			}
		}

	};
});