import StructuralMetadataUtils from './StructuralMetadataUtils';
import Peaks from 'peaks.js';

const structMetadataUtils = new StructuralMetadataUtils();

// Colors for segments from Avalon branding pallette
const COLOR_PALETTE = ['#80A590', '#2A5459'];

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
   * @param {Array} smData - updated structured metadata
   * @param {Object} peaksInstance - peaks instance for the waveform
   */
  insertNewSegment(smData, peaksInstance) {
    const allSpans = structMetadataUtils.getItemsOfType('span', smData);
    const segments = peaksInstance.segments.getSegments();
    const newSpan = allSpans.filter(
      span => !segments.some(segment => segment.id === span.id)
    );
    const { begin, end, label, id } = newSpan[0];
    peaksInstance.segments.add({
      startTime: structMetadataUtils.toMs(begin) / 1000,
      endTime: structMetadataUtils.toMs(end) / 1000,
      labelText: label,
      id: id
    });

    return this.updateSegmentColors(peaksInstance, smData);
  }

  /**
   * Delete the corresponding segment when a timespan is deleted
   * @param {String} id - ID of the segment that is being deleted
   * @param {Array} smData - updated structured metadata
   * @param {Object} peaksInstance - peaks instance for the current waveform
   */
  deleteSegment(id, smData, peaksInstance) {
    peaksInstance.segments.removeById(id);
    return this.updateSegmentColors(peaksInstance, smData);
  }

  /**
   * Update the colors of the segment to alternate between colors in Avalon color pallette
   * @param {Object} peaksInstance - current peaks instance for the waveform
   * @param {Array} allItems - updated structured metadata
   */
  updateSegmentColors(peaksInstance, allItems) {
    const allSpans = structMetadataUtils.getItemsOfType('span', allItems);
    const segments = peaksInstance.segments.getSegments();

    peaksInstance.segments.removeAll();

    // Update the colors of each segment
    segments.forEach(segment => {
      let id = segment.id;
      let index = allSpans.map(span => span.id).indexOf(id);
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
    // Copy the current segment
    let tempSegment = peaksInstance.segments.getSegment(id);
    // Remove the current segment
    peaksInstance.segments.removeById(id);
    // Create a new segment with the same properties and set editable to true
    peaksInstance.segments.add({
      ...tempSegment,
      editable: true,
      color: '#FBB040'
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
