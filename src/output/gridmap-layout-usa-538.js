// Define module using Universal Module Definition pattern
// https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // Support AMD. Register as an anonymous module.
    define([], factory);
  }
  else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory();
  }
  else {
    // No AMD. Set module as a global variable
    root.gridmapLayoutUsa = factory();
  }
}(this, function () {
  return [
  {
    "x": 10,
    "y": 0,
    "key": "ME",
    "name": "Maine"
  },
  {
    "x": 5,
    "y": 1,
    "key": "WI",
    "name": "Wisconsin"
  },
  {
    "x": 9,
    "y": 1,
    "key": "VT",
    "name": "Vermont"
  },
  {
    "x": 10,
    "y": 1,
    "key": "NH",
    "name": "New Hampshire"
  },
  {
    "x": 0,
    "y": 2,
    "key": "WA",
    "name": "Washington"
  },
  {
    "x": 1,
    "y": 2,
    "key": "ID",
    "name": "Idaho"
  },
  {
    "x": 2,
    "y": 2,
    "key": "MT",
    "name": "Montana"
  },
  {
    "x": 3,
    "y": 2,
    "key": "ND",
    "name": "North Dakota"
  },
  {
    "x": 4,
    "y": 2,
    "key": "MN",
    "name": "Minnesota"
  },
  {
    "x": 5,
    "y": 2,
    "key": "IL",
    "name": "Illinois"
  },
  {
    "x": 6,
    "y": 2,
    "key": "MI",
    "name": "Michigan"
  },
  {
    "x": 8,
    "y": 2,
    "key": "NY",
    "name": "New York"
  },
  {
    "x": 9,
    "y": 2,
    "key": "MA",
    "name": "Massachusetts"
  },
  {
    "x": 0,
    "y": 3,
    "key": "OR",
    "name": "Oregon"
  },
  {
    "x": 1,
    "y": 3,
    "key": "NV",
    "name": "Nevada"
  },
  {
    "x": 2,
    "y": 3,
    "key": "WY",
    "name": "Wyoming"
  },
  {
    "x": 3,
    "y": 3,
    "key": "SD",
    "name": "South Dakota"
  },
  {
    "x": 4,
    "y": 3,
    "key": "IA",
    "name": "Iowa"
  },
  {
    "x": 5,
    "y": 3,
    "key": "IN",
    "name": "Indiana"
  },
  {
    "x": 6,
    "y": 3,
    "key": "OH",
    "name": "Ohio"
  },
  {
    "x": 7,
    "y": 3,
    "key": "PA",
    "name": "Pennsylvania"
  },
  {
    "x": 8,
    "y": 3,
    "key": "NJ",
    "name": "New Jersey"
  },
  {
    "x": 9,
    "y": 3,
    "key": "CT",
    "name": "Connecticut"
  },
  {
    "x": 10,
    "y": 3,
    "key": "RI",
    "name": "Rhode Island"
  },
  {
    "x": 0,
    "y": 4,
    "key": "CA",
    "name": "California"
  },
  {
    "x": 1,
    "y": 4,
    "key": "UT",
    "name": "Utah"
  },
  {
    "x": 2,
    "y": 4,
    "key": "CO",
    "name": "Colorado"
  },
  {
    "x": 3,
    "y": 4,
    "key": "NE",
    "name": "Nebraska"
  },
  {
    "x": 4,
    "y": 4,
    "key": "MO",
    "name": "Missouri"
  },
  {
    "x": 5,
    "y": 4,
    "key": "KY",
    "name": "Kentucky"
  },
  {
    "x": 6,
    "y": 4,
    "key": "WV",
    "name": "West Virginia"
  },
  {
    "x": 7,
    "y": 4,
    "key": "VA",
    "name": "Virginia"
  },
  {
    "x": 8,
    "y": 4,
    "key": "MD",
    "name": "Maryland"
  },
  {
    "x": 9,
    "y": 4,
    "key": "DE",
    "name": "Delaware"
  },
  {
    "x": 1,
    "y": 5,
    "key": "AZ",
    "name": "Arizona"
  },
  {
    "x": 2,
    "y": 5,
    "key": "NM",
    "name": "New Mexico"
  },
  {
    "x": 3,
    "y": 5,
    "key": "KS",
    "name": "Kansas"
  },
  {
    "x": 4,
    "y": 5,
    "key": "AR",
    "name": "Arkansas"
  },
  {
    "x": 5,
    "y": 5,
    "key": "TN",
    "name": "Tennessee"
  },
  {
    "x": 6,
    "y": 5,
    "key": "NC",
    "name": "North Carolina"
  },
  {
    "x": 7,
    "y": 5,
    "key": "SC",
    "name": "South Carolina"
  },
  {
    "x": 3,
    "y": 6,
    "key": "OK",
    "name": "Oklahoma"
  },
  {
    "x": 4,
    "y": 6,
    "key": "LA",
    "name": "Louisiana"
  },
  {
    "x": 5,
    "y": 6,
    "key": "MS",
    "name": "Mississippi"
  },
  {
    "x": 6,
    "y": 6,
    "key": "AL",
    "name": "Alabama"
  },
  {
    "x": 7,
    "y": 6,
    "key": "GA",
    "name": "Georgia"
  },
  {
    "x": 0,
    "y": 7,
    "key": "HI",
    "name": "Hawaii"
  },
  {
    "x": 1,
    "y": 7,
    "key": "AK",
    "name": "Alaska"
  },
  {
    "x": 3,
    "y": 7,
    "key": "TX",
    "name": "Texas"
  },
  {
    "x": 8,
    "y": 7,
    "key": "FL",
    "name": "Florida"
  }
];
}));