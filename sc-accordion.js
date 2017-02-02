'use strict';

class SCAccordion extends HTMLElement {
  createdCallback () {
    this._panes = null;
  }

  attachedCallback () {
    this._panes = this.querySelectorAll('sc-pane');
    this._calculateGeometries();
    this._movePanels();
    this._addEventListeners();

    requestAnimationFrame(_ => this.setAttribute('active', ''));
  }

  detachedCallback () {
    this._panes = null;
  }

  _addEventListeners () {
    this.addEventListener('panel-change', this._onPanelChange);
  }

  _onPanelChange (evt) {
    const target = evt.target;
    this._panes.forEach(pane => {
      pane.removeAttribute('aria-expanded');
      pane.setAttribute('aria-hidden', 'true');
    });

    target.setAttribute('aria-expanded', 'true');
    target.removeAttribute('aria-hidden');

    requestAnimationFrame(_ => this._movePanels());
  }

  _calculateGeometries () {
    if (this._panes.length === 0)
      return;

    this._headerHeight = this._panes[0].header.offsetHeight;
    this._availableHeight = this.offsetHeight -
      (this._panes.length * this._headerHeight);
  }

  _movePanels () {
    let baseY = 0;
    this._panes.forEach((pane, index) => {
      pane.style.transform = `translateY(${baseY + (this._headerHeight * index)}px)`;
      pane.content.style.height = `${this._availableHeight}px`;

      if (pane.getAttribute('aria-expanded')) {
        baseY = this._availableHeight;
      }
    });
  }
}

document.registerElement('sc-accordion', SCAccordion);
