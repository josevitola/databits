import c3 from  'c3';

var chart = c3.generate({
  bindto: '#chart',
  size: {
    height: 200,
    width: 450
  },
  data: {
    columns: [
      [
        'security', 10
      ],
      [
        'distance', 10
      ],
      ['price', 10]
    ],
    type: 'bar'
  },
  bar: {
    width: {
      ratio: 0.5 // this makes bar width 50% of length between ticks
    }
  }
});
