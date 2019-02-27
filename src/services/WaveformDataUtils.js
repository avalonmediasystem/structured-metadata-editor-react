import StructuralMetadataUtils from './StructuralMetadataUtils';
import Peaks from 'peaks.js';

const structMetadataUtils = new StructuralMetadataUtils();

// Colors for segments from Avalon branding pallette
const COLOR_PALETTE = ['#80A590', '#2A5459', '#FBB040'];

export default class WaveformDataUtils {
  /**
   * Initialize Peaks instance for the app
   * @param {Array} smData - current structured metadata from the server masterfile
   * @param {Object} options - set of configurations for setting up Peaks for the app
   */
  initPeaks(smData, options) {
    let initSegments = [];
    let count = 0;

    // Recursively build segments for timespans in the structure
    let createSegment = items => {
      for (let item of items) {
        if (item.type === 'span') {
          count = count > 1 ? 0 : count;
          const { begin, end, label, id } = item;
          initSegments.push({
            startTime: structMetadataUtils.toMs(begin) / 1000,
            endTime: structMetadataUtils.toMs(end) / 1000,
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

    // Initialize peaks instance
    let peaksInstance = Peaks.init({
      ...options,
      segments: initSegments
    });

    return peaksInstance;
  }

  /**
   * Add a new segment to Peaks when a new timespan is created
   * @param {Object} newSpan - new span created for the user input
   * @param {Object} peaksInstance - peaks instance for the waveform
   */
  insertNewSegment(newSpan, peaksInstance) {
    const { begin, end, label, id } = newSpan;
    peaksInstance.segments.add({
      startTime: structMetadataUtils.toMs(begin) / 1000,
      endTime: structMetadataUtils.toMs(end) / 1000,
      labelText: label,
      id: id
    });

    return peaksInstance;
  }

  /**
   * Delete the corresponding segment when a timespan is deleted
   * @param {Object} item - item to be deleted
   * @param {Object} peaksInstance - peaks instance for the current waveform
   */
  deleteSegments(item, peaksInstance) {
    let deleteChildren = item => {
      let children = item.items;
      for (let child of children) {
        if (child.type === 'span') {
          peaksInstance.segments.removeById(child.id);
        }
        if (child.items && child.items.length > 0) {
          deleteChildren(child);
        }
      }
    };

    if (item.type === 'div') {
      deleteChildren(item);
    }

    peaksInstance.segments.removeById(item.id);
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
    // Check for existing editable segments
    let existingEditableSegs = peaksInstance.segments
      .getSegments()
      .filter(seg => seg.editable);

    if (existingEditableSegs) {
      existingEditableSegs.map(seg =>
        this.deactivateSegment(seg.id, peaksInstance)
      );
    }

    // Remove the current segment
    const [removedSegment] = peaksInstance.segments.removeById(id);

    // Create a new segment with the same properties and set editable to true
    peaksInstance.segments.add({
      ...removedSegment,
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
    // Sort segments by start time
    let segments = peaksInstance.segments
      .getSegments()
      .sort((x, y) => x.startTime - y.startTime);

    let index = segments.map(seg => seg.id).indexOf(id);

    // Remove the current segment
    const [removedSegment] = peaksInstance.segments.removeById(id);
    // Create a new segment and revert to its original color
    peaksInstance.segments.add({
      ...removedSegment,
      editable: false,
      color: this.isOdd(index) ? COLOR_PALETTE[1] : COLOR_PALETTE[0]
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

  isOdd(num) {
    return num % 2;
  }
}
