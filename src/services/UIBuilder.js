import _ from 'lodash';

export default class UIBuilder {
  buildTreeFromJSON(items, list = [], newUL = false, nodeCounter = 0) {
    nodeCounter++;
    if (newUL) {
      list.push(`<ul class="structure-list" id="ul-${nodeCounter}">`);
    }

    items.forEach((item, i) => {
      const hasChildren = item.items && item.items.length > 0;

      // Div
      if (item.type === 'div') {
        newUL = true;
        list.push(`<li id="node-${i}">`);
        list.push(this.buildDiv(item));
        if (hasChildren) {
          this.buildTreeFromJSON(item.items, list, newUL, nodeCounter);
        }
        nodeCounter++;
        list.push('</li>');
      }
      // Span
      else if (item.type === 'span') {
        list.push(`<li id="node-${i}">`);
        list.push(this.buildSpan(item));
        list.push('</li>');
      }
    });

    if (newUL) {
      list.push('</ul>');
    }

    return list.join('');
  }

  buildSpan(item) {
    const { label, begin, end } = item;

    return `
      <div class="row-wrapper">
        <span class="structure-title">${label} (${begin} - ${end})</span>
        <div class="edit-controls-wrapper">
          <a href="#">(add parent)</a>
          <i class="fas fa-pen"></i>
          <i class="fas fa-trash delete-button"></i>
        </div>
      </div>`;
  }

  buildDiv(item) {
    return `
      <div class="row-wrapper">
        <span class="structure-title heading">${item.label}</span>
        <div class="edit-controls-wrapper">
          <a href="#">(add child)</a>
          <i class="fas fa-pen"></i>
          <i class="fas fa-trash delete-button"></i>
        </div>
      </div>`;
  }

}
