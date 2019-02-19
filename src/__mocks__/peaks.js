export const Peaks = jest.fn(opts => {
  let peaks = {};
  peaks.options = opts;
  peaks.zoom = {
    zoomIn: jest.fn(() => {
      peaks.zoom._zoomLevelIndex >= 0
        ? (peaks.zoom._zoomLevelIndex = peaks.zoom._zoomLevelIndex - 1)
        : peaks.zoom._zoomLevelIndex;
    }),
    zoomOut: jest.fn(() => {
      peaks.zoom._zoomLevelIndex < peaks.zoom._zoomLevels.length
        ? (peaks.zoom._zoomLevelIndex = peaks.zoom._zoomLevelIndex + 1)
        : peaks.zoom._zoomLevelIndex;
    }),
    _peaks: peaks,
    _zoomLevelIndex: 2,
    _zoomLevels: [512, 1024, 2048, 4096]
  };
  peaks.player = {
    seek: jest.fn(time => {
      peaks.player._mediaElement.currentTime = time;
    }),
    _mediaElement: {
      currentTime: 0
    }
  };
  peaks.segments = {
    getSegment: jest.fn(id => {
      peaks.segments._segments.find(seg => {
        return seg.id === id;
      });
    }),
    getSegments: jest.fn(() => {
      return peaks.segments._segments;
    }),
    removeAll: jest.fn(() => {
      peaks.segments._segments = [];
    }),
    add: jest.fn(segment => {
      let index = peaks.segments._segments.length;
      peaks.segments._segments.splice(index, 0, segment);
    }),
    removeById: jest.fn(id => {
      let index = peaks.segments._segments.map(seg => seg.id).indexOf(id);
      peaks.segments._segments.splice(index, 1);
    }),
    _peaks: peaks,
    _segments: [
      {
        startTime: 0,
        endTime: 360,
        id: '123a-456b-789c-2d',
        labelText: 'Sample segment',
        color: '#80A590'
      },
      {
        startTime: 750,
        endTime: 1259.99,
        id: '123a-456b-789c-9d',
        labelText: 'Last segment',
        color: '#2A5459'
      }
    ]
  };
  return peaks;
});

export default {
  init: jest.fn(opts => {
    return Peaks(opts);
  })
};
