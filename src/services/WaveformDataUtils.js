import StructuralMetadataUtils from './StructuralMetadataUtils';
import Peaks from 'peaks.js';

const structMetadataUtils = new StructuralMetadataUtils();

// Colors for segments from Avalon branding pallette
const colors = ['#80A590', '#2A5459'];

export default class WaveformDataUtils {
  initPeaks(smData, peaksInstance, options) {
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
            editable: true,
            labelText: label,
            id: id,
            color: colors[count]
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
    peaksInstance = Peaks.init({
      ...options,
      segments: initSegments
    });

    return peaksInstance;
  }
}
