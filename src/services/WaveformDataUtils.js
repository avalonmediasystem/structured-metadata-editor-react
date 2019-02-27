// Colors for segments from Avalon branding pallette
const COLOR_PALETTE = ['#80A590', '#2A5459', '#FBB040'];

export default class WaveformDataUtils {
  /**
   * Initialize Peaks instance for the app
   * @param {Array} smData - current structured metadata from the server masterfile
   */
  initSegments(smData) {
    let initSegments = [];
    let count = 0;

    // Recursively build segments for timespans in the structure
    let createSegment = items => {
      for (let item of items) {
        if (item.type === 'span') {
          count = count > 1 ? 0 : count;
          const { begin, end, label, id } = item;
          initSegments.push({
            startTime: this.toMs(begin),
            endTime: this.toMs(end),
            labelText: label,
            id: id,
            color: COLOR_PALETTE[count]
          });
          count++;
        }
        if (item.items && item.items.length > 0) {
          createSegment(item.items);
        }
      }
    };

    // Build segments from initial metadata structure
    createSegment(smData);

    return initSegments;
  }

  /**
   * Add a new segment to Peaks when a new timespan is created
   * @param {Object} newSpan - new span created for the user input
   * @param {Object} peaksInstance - peaks instance for the waveform
   */
  insertNewSegment(newSpan, peaksInstance) {
    const { begin, end, label, id } = newSpan;
    peaksInstance.segments.add({
      startTime: this.toMs(begin),
      endTime: this.toMs(end),
      labelText: label,
      id: id
    });

    return peaksInstance;
  }

  /**
   * Delete the corresponding segment when a timespan is deleted
   * @param {String} id - ID of the segment that is being deleted
   * @param {Object} peaksInstance - peaks instance for the current waveform
   */
  deleteSegment(id, peaksInstance) {
    peaksInstance.segments.removeById(id);
    return peaksInstance;
  }

  /**
   * Update the colors of the segment to alternate between colors in Avalon color pallette
   * @param {Object} peaksInstance - current peaks instance for the waveform
   */
  rebuildPeaks(peaksInstance) {
    let clonedSegments = peaksInstance.segments
      .getSegments()
      .sort((x, y) => x.startTime - y.startTime);
    peaksInstance.segments.removeAll();
    clonedSegments.forEach((segment, index) => {
      segment.color = this.isOdd(index) ? COLOR_PALETTE[1] : COLOR_PALETTE[0];
      peaksInstance.segments.add(segment);
    });

    return peaksInstance;
  }

  /**
   * Change color and add handles for editing the segment in the waveform
   * @param {String} id - ID of the segment to be edited
   * @param {Object} peaksInstance - current peaks instance for the waveform
   */
  activateSegment(id, peaksInstance) {
    // Copy the current segment
    const tempSegment = peaksInstance.segments.getSegment(id);
    // Remove the current segment
    peaksInstance.segments.removeById(id);

    // Create a new segment with the same properties and set editable to true
    peaksInstance.segments.add({
      ...tempSegment,
      editable: true,
      color: COLOR_PALETTE[2]
    });

    let startTime = peaksInstance.segments.getSegment(id).startTime;
    // Move play head to the start time of the selected segment
    peaksInstance.player.seek(startTime);

    return peaksInstance;
  }

  /**
   * Revert color and remove handles for editing of the segment
   * @param {String} id - ID of the segment being saved
   * @param {Object} peaksInstance - current peaks instance for the waveform
   */
  deactivateSegment(id, peaksInstance) {
    // Copy the current segment
    let tempSegment = peaksInstance.segments.getSegment(id);

    // Sort segments by start time
    let segments = peaksInstance.segments
      .getSegments()
      .sort((x, y) => x.startTime - y.startTime);

    let index = segments.map(seg => seg.id).indexOf(id);

    // Remove the current segment
    peaksInstance.segments.removeById(id);
    // Create a new segment and revert to its original color
    peaksInstance.segments.add({
      ...tempSegment,
      editable: false,
      color: this.isOdd(index) ? COLOR_PALETTE[1] : COLOR_PALETTE[0]
    });

    return peaksInstance;
  }

  /**
   * Save the segment into the Peaks
   * @param {Object} currentState - current values for the timespan to be saved
   * @param {Object} peaksInstance - current peaks instance for waveform
   */
  saveSegment(currentState, peaksInstance) {
    const { beginTime, endTime, clonedSegment } = currentState;
    peaksInstance.segments.removeById(clonedSegment.id);
    peaksInstance.segments.add({
      ...clonedSegment,
      startTime: this.toMs(beginTime),
      endTime: this.toMs(endTime)
    });
    return peaksInstance;
  }

  /**
   * Reverse the changes made in peaks waveform when changes are cancelled
   * @param {String} id - ID of the segment being editied
   * @param {Object} clonedSegment - cloned segment before changing peaks waveform
   * @param {Object} peaksInstance - current peaks instance for wavefrom
   */
  revertChanges(id, clonedSegment, peaksInstance) {
    peaksInstance.segments.removeById(id);
    peaksInstance.segments.add(clonedSegment);
    return peaksInstance;
  }

  /**
   * Update Peaks instance when user changes the start and end times from the edit forms
   * @param {Object} segment - segment related to timespan
   * @param {Object} currentState - current begin and end times from the input form
   * @param {Object} peaksInstance - current peaks instance for waveform
   */
  updateSegment(segment, currentState, peaksInstance) {
    const { beginTime, endTime } = currentState;
    let beginSeconds = this.toMs(beginTime);
    let endSeconds = this.toMs(endTime);
    if (beginSeconds < segment.endTime && segment.startTime !== beginSeconds) {
      let [removed] = peaksInstance.segments.removeById(segment.id);
      peaksInstance.segments.add({
        ...removed,
        startTime: beginSeconds
      });
      return peaksInstance;
    }
    if (endSeconds > segment.startTime && segment.endTime !== endSeconds) {
      let [removed] = peaksInstance.segments.removeById(segment.id);
      peaksInstance.segments.add({
        ...removed,
        endTime: endSeconds
      });
      return peaksInstance;
    }
    return peaksInstance;
  }

  isOdd(num) {
    return num % 2;
  }

  toMs(strTime) {
    let [hours, minutes, seconds] = strTime.split(':');
    let hoursAndMins = parseInt(hours) * 3600 + parseInt(minutes) * 60;
    let secondsIn = seconds === '' ? 0.0 : parseFloat(seconds);
    return hoursAndMins + secondsIn;
  }
}
