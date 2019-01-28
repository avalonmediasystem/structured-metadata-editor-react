import StructuralMetadataUtils from './StructuralMetadataUtils';

const smu = new StructuralMetadataUtils();

describe('StructuralMetadataUtils class', () => {
  test('creates a helper drop zone object for drag and drop', () => {
    const value = smu.createDropZoneObject();
    expect(value).toHaveProperty('id');
    expect(value).toHaveProperty('type', 'optional');
  });

  test('creates a helper span object', () => {
    const obj = {
      beginTime: '00:00:01',
      endTime: '00:00:02',
      timespanChildOf: '3bf42620-2321-11e9-aa56-f9563015e266',
      timespanTitle: 'Tester'
    };
    const value = smu.createSpanObject(obj);

    expect(value).toHaveProperty('id');
    expect(value).toHaveProperty('type', 'span');
    expect(value).toHaveProperty('begin', '00:00:01');
    expect(value).toHaveProperty('end', '00:00:02');
    expect(value).toHaveProperty('label', 'Tester');
  });
});
