import { Control, ControlPosition, DomUtil, Util } from 'leaflet';

const FullScreenMap = Control.extend({
  initialize(options: { position: ControlPosition }): void {
    Util.setOptions(this, options);
  },
  options: {
    position: 'topleft',
    id: ''
  },
  onAdd(): HTMLInputElement {
    const container = DomUtil.create('input', 'leaflet-control-zoom leaflet-bar leaflet-control');
    container.type = 'button';
    container.title = 'Full screen';
    container.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/512/2089/2089670.png)';
    container.style.backgroundSize = '15px 15px';
    container.style.backgroundRepeat = 'no-repeat';
    container.style.backgroundPosition = '50% 50%';
    container.style.width = '32px';
    container.style.height = '32px';
    container.style.padding = '12px';
    container.style.lineHeight = '30px';
    container.style.fontSize = '22px';
    container.style.fontWeight = 'bold';
    container.style.cursor = 'pointer';

    container.onclick = () => {
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen
      if (document.fullscreenEnabled && !document.fullscreen) {
        const p = document.getElementById(this.options.id);
        document.getElementById(this.options.id)?.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    };

    return container;
  }
});

export const fullScreenMap = (options?: { position?: ControlPosition; id?: string }) => new FullScreenMap(options);
