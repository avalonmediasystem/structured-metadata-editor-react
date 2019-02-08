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
  peaks.segments = {};
  return peaks;
});

export default {
  init: jest.fn(opts => {
    return Peaks(opts);
  })
};
