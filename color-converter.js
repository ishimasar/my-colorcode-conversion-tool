/**
 * This class converts various color codes. HSLA is assumed.
 */
class ColorConverter {
  /**
   * Creates an instance of ColorConverter.
   * @param {string} convertButton
   * @param {string} output
   * @param {string} copy
   * @param {string} colorType
   */
  constructor(convertButton, output, copy, colorType) {
    this.button = document.getElementById(convertButton);
    this.output = document.getElementById(output);
    this.copy = document.getElementById(copy);
    this.colorType = document.getElementById(colorType);
  }

  /**
   * Private method. Append an underscore to the name.
   * @param {HTMLElement} elm
   */
  async _copyToClipboard(elm) {
    this.element = elm.previousElementSibling;
    // This Clipboard API description can be used only in the https/LTS communication environment.
    if (navigator.clipboard && !this.element.textContent === false) {
      await navigator.clipboard.writeText(this.element.textContent);
      this.copy.textContent = 'Copied!';
    } else if (!navigator.clipboard) {
      // Alternatives outside the https/LTS communication environment such as local.
      if (document.execCommand) {
        // generate input element
        this.inputEle = document.createElement('input');
        this.inputEle.setAttribute('type', 'text');
        this.inputEle.setAttribute('value', this.output.innerHTML);
        document.body.appendChild(this.inputEle);
        this.inputEle.select();
        // execute copy
        this.execResult = document.execCommand('copy');
        this.inputEle.parentNode.removeChild(this.inputEle);
        // console.log('execCommand : ' + this.execResult);
        this.copy.textContent = 'Copied!';
      }
    } else {
      this.copy.textContent = 'Not Copied!';
    }
  }

  /**
   * Dummy empty method.
   */
  _method() {}

  /**
   * Public method.
   */
  convertCode() {
    this.button.addEventListener('click', () => {
      this.val = this.colorType.value;
      this.t = this._method(this.val);
      this.output.innerText = this.t;
      this.copy.innerText = '←Copy';
    });
  }

  copyString() {
    this.copy.addEventListener('click', () => {
      return this._copyToClipboard(this.copy);
    });
  }
}

/**
 * Convert HexA to HSLA.
 * @extends {ColorConverter}
 */
class HexAToHSLA extends ColorConverter {
  constructor(convertButton, output, copy, colorType) {
    super(convertButton, output, copy, colorType);
    // execute the method
    this.hexAToHSLA();
  }

  /**
   * Method to convert Hex(A) to HSLA. overriding the parent class method.
   * @param {string} H Abbreviation for Hex.
   * @return {string} Value of HSLA property or error statement.
   * @memberof HexAToHSLA
   */
  _method(H) {
    // console.log('P', H);
    if (H.length === 4 || H.length === 7) {
      let ex = /^#([\da-f]{3}){1,2}$/i;
      if (ex.test(H)) {
        // convert hex to RGB first
        let r = 0,
          g = 0,
          b = 0;
        if (H.length === 4) {
          r = '0x' + H[1] + H[1];
          g = '0x' + H[2] + H[2];
          b = '0x' + H[3] + H[3];
        } else if (H.length === 7) {
          r = '0x' + H[1] + H[2];
          g = '0x' + H[3] + H[4];
          b = '0x' + H[5] + H[6];
        }
        // then to HSL
        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r, g, b),
          cmax = Math.max(r, g, b),
          delta = cmax - cmin,
          h = 0,
          s = 0,
          l = 0;

        if (delta === 0) h = 0;
        else if (cmax === r) h = ((g - b) / delta) % 6;
        else if (cmax === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        if (h < 0) h += 360;

        l = (cmax + cmin) / 2;
        s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(0);
        l = +(l * 100).toFixed(0);

        return 'hsla(' + h + ', ' + s + '%, ' + l + '%, 1)';
      }
    } else if (H.length === 5 || H.length === 9) {
      let ex = /^#([\da-f]{4}){1,2}$/i;
      if (ex.test(H)) {
        let r = 0,
          g = 0,
          b = 0,
          a = 1;
        // 4 digits
        if (H.length === 5) {
          r = '0x' + H[1] + H[1];
          g = '0x' + H[2] + H[2];
          b = '0x' + H[3] + H[3];
          a = '0x' + H[4] + H[4];
          // 8 digits
        } else if (H.length === 9) {
          r = '0x' + H[1] + H[2];
          g = '0x' + H[3] + H[4];
          b = '0x' + H[5] + H[6];
          a = '0x' + H[7] + H[8];
        }

        // normal conversion to HSLA
        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r, g, b),
          cmax = Math.max(r, g, b),
          delta = cmax - cmin,
          h = 0,
          s = 0,
          l = 0;

        if (delta === 0) h = 0;
        else if (cmax === r) h = ((g - b) / delta) % 6;
        else if (cmax === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        if (h < 0) h += 360;

        l = (cmax + cmin) / 2;
        s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(0);
        l = +(l * 100).toFixed(0);

        a = (a / 255).toFixed(2);
        this.aSpr = Number(String(a));

        return 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + this.aSpr + ')';
      }
    } else if (H === '') {
      return 'Please enter value';
    } else {
      return 'Invalid input color';
    }
  }
  /**
   * Call superclass method.
   */
  hexAToHSLA() {
    super.convertCode();
    super.copyString();
  }
}
/** @type {object} */
const convertHexAToHSLA = new HexAToHSLA(
  'convert-button-hxhs',
  'output-hxhs',
  'copy-hxhs',
  'hex'
);

// ---
/**
 * Convert color name t HSLA.
 * @extends {ColorConverter}
 */
class NameToHSLA extends ColorConverter {
  constructor(convertButton, output, copy, colorType) {
    super(convertButton, output, copy, colorType);
    this.nameToHSLA();
  }

  /**
   * Method to convert ColorName to HSLA. overriding the parent class method.
   * @param {string} name HTML ColorName
   * @return {}
   */
  _method(name) {
    if (name !== '') {
      let fakeDiv = document.createElement('div');
      fakeDiv.style.color = name;
      document.body.appendChild(fakeDiv);
      let cs = window.getComputedStyle(fakeDiv),
        pv = cs.getPropertyValue('color');
      document.body.removeChild(fakeDiv);

      // code ripped from RGBToHSLA() (except pv is substringed)
      let rgb = pv.substr(4).split(')')[0].split(','),
        r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255,
        cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

      if (delta == 0) h = 0;
      else if (cmax == r) h = ((g - b) / delta) % 6;
      else if (cmax == g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;

      h = Math.round(h * 60);
      if (h < 0) h += 360;

      l = (cmax + cmin) / 2;
      s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      s = +(s * 100).toFixed(0);
      l = +(l * 100).toFixed(0);

      return 'hsla(' + h + ', ' + s + '%, ' + l + '%, 1)';
    } else if (name === '') {
      return 'Please enter value';
    } else {
      return 'Invalid input color';
    }
  }
  /**
   * Call superclass method.
   */
  nameToHSLA() {
    super.convertCode();
    super.copyString();
  }
}
/** @type {object} */
const convertNameToHSLA = new NameToHSLA(
  'convert-button-cnhs',
  'output-cnhs',
  'copy-cnhs',
  'color-name'
);

// ---
/**
 * Convert RGBA to HSLA. Plans to convert to RGB.
 * @extends {ColorConverter}
 */
class RGBAToHSLA extends ColorConverter {
  constructor(convertButton, output, copy, colorType) {
    super(convertButton, output, copy, colorType);
    this.RGBAToHSLA();
  }

  /**
   * Method to convert RGBA to HSLA.
   * @param {string} rgba
   */
  _method(rgba) {
    let ex1 =
      /^rgba\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){3}))|(((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){3}))\/\s)((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
    let ex2 =
      /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;
    if (ex1.test(rgba)) {
      let sep = rgba.indexOf(',') > -1 ? ',' : ' ';
      rgba = rgba.substr(5).split(')')[0].split(sep);

      // strip the slash if using space-separated syntax
      if (rgba.indexOf('/') > -1) rgba.splice(3, 1);

      for (let R in rgba) {
        let r = rgba[R];
        if (r.indexOf('%') > -1) {
          let p = r.substr(0, r.length - 1) / 100;

          if (R < 3) {
            rgba[R] = Math.round(p * 255);
          }
        }
      }

      // make r, g, and b fractions of 1
      let r = rgba[0] / 255,
        g = rgba[1] / 255,
        b = rgba[2] / 255,
        a = rgba[3],
        // find greatest and smallest channel values
        cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

      // calculate hue
      // no difference
      if (delta == 0) h = 0;
      // red is max
      else if (cmax == r) h = ((g - b) / delta) % 6;
      // green is max
      else if (cmax == g) h = (b - r) / delta + 2;
      // blue is max
      else h = (r - g) / delta + 4;

      h = Math.round(h * 60);

      // make negative hues positive behind 360°
      if (h < 0) h += 360;

      // calculate lightness
      l = (cmax + cmin) / 2;

      // calculate saturation
      s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

      // multiply l and s by 100
      s = +(s * 100).toFixed(0);
      l = +(l * 100).toFixed(0);

      return 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';
    } else if (ex2.test(rgba)) {
      let sep = rgba.indexOf(',') > -1 ? ',' : ' ';
      rgba = rgba.substr(4).split(')')[0].split(sep);

      // convert %s to 0–255
      for (let R in rgba) {
        let r = rgba[R];
        if (r.indexOf('%') > -1)
          rgba[R] = Math.round((r.substr(0, r.length - 1) / 100) * 255);
      }

      // make r, g, and b fractions of 1
      let r = rgba[0] / 255,
        g = rgba[1] / 255,
        b = rgba[2] / 255,
        // find greatest and smallest channel values
        cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

      // calculate hue
      // no difference
      if (delta == 0) h = 0;
      // red is max
      else if (cmax == r) h = ((g - b) / delta) % 6;
      // green is max
      else if (cmax == g) h = (b - r) / delta + 2;
      // blue is max
      else h = (r - g) / delta + 4;

      h = Math.round(h * 60);

      // make negative hues positive behind 360°
      if (h < 0) h += 360;

      // calculate lightness
      l = (cmax + cmin) / 2;

      // calculate saturation
      s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

      // multiply l and s by 100
      s = +(s * 100).toFixed(0);
      l = +(l * 100).toFixed(0);

      return 'hsla(' + h + ', ' + s + '%, ' + l + '%, 1)';
    } else if (rgba === '') {
      return 'Please enter value';
    } else {
      return 'Invalid input color';
    }
  }
  /**
   * Call superclass method.
   */
  RGBAToHSLA() {
    super.convertCode();
    super.copyString();
  }
}
/** @type {object} */
const convertRGBAToHSLA = new RGBAToHSLA(
  'convert-button-rghs',
  'output-rghs',
  'copy-rghs',
  'rgba'
);

// ---
/**
 * Convert HSLA to Hex.
 * @extends {ColorConverter}
 */
class HSLAToHex extends ColorConverter {
  constructor(convertButton, output, copy, colorType) {
    super(convertButton, output, copy, colorType);
    this.HSLAToHex();
  }

  /**
   * Method to convert HSLA to Hex.
   * @param {string} hsla
   */
  _method(hsla) {
    let ex1 =
      /^hsla\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)(((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2},\s?)|((\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}\s\/\s))((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
    let ex2 =
      /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;
    if (ex1.test(hsla)) {
      let sep = hsla.indexOf(',') > -1 ? ',' : ' ';
      hsla = hsla.substr(5).split(')')[0].split(sep);
      console.log(sep, hsla);

      // strip the slash
      if (hsla.indexOf('/') > -1) hsla.splice(3, 1);

      let h = hsla[0],
        s = hsla[1].substr(0, hsla[1].length - 1) / 100,
        l = hsla[2].substr(0, hsla[2].length - 1) / 100,
        a = hsla[3];

      // strip label and convert to degrees (if necessary)
      if (h.indexOf('deg') > -1) h = h.substr(0, h.length - 3);
      else if (h.indexOf('rad') > -1)
        h = Math.round(h.substr(0, h.length - 3) * (180 / Math.PI));
      else if (h.indexOf('turn') > -1)
        h = Math.round(h.substr(0, h.length - 4) * 360);
      if (h >= 360) h %= 360;

      // strip % from alpha, make fraction of 1 (if necessary)
      if (a.indexOf('%') > -1) a = a.substr(0, a.length - 1) / 100;

      let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

      if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
      }
      r = Math.round((r + m) * 255).toString(16);
      g = Math.round((g + m) * 255).toString(16);
      b = Math.round((b + m) * 255).toString(16);
      // a = Math.round(a * 255).toString(16);

      if (r.length == 1) r = '0' + r;
      if (g.length == 1) g = '0' + g;
      if (b.length == 1) b = '0' + b;
      // if (a.length == 1) a = '0' + a;

      return '#' + r + g + b;
    } else if (ex2.test(hsla)) {
      let sep = hsla.indexOf(',') > -1 ? ',' : ' ';
      hsla = hsla.substr(4).split(')')[0].split(sep);

      let h = hsla[0],
        s = hsla[1].substr(0, hsla[1].length - 1) / 100,
        l = hsla[2].substr(0, hsla[2].length - 1) / 100;
      console.log(h);

      // strip label and convert to degrees (if necessary)
      if (h.indexOf('deg') > -1) h = h.substr(0, h.length - 3);
      else if (h.indexOf('rad') > -1)
        h = Math.round(h.substr(0, h.length - 3) * (180 / Math.PI));
      else if (h.indexOf('turn') > -1)
        h = Math.round(h.substr(0, h.length - 4) * 360);
      if (h >= 360) h %= 360;

      let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

      if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
      }
      // having obtained RGB, convert channels to hex
      r = Math.round((r + m) * 255).toString(16);
      g = Math.round((g + m) * 255).toString(16);
      b = Math.round((b + m) * 255).toString(16);

      // prepend 0s if necessary
      if (r.length == 1) r = '0' + r;
      if (g.length == 1) g = '0' + g;
      if (b.length == 1) b = '0' + b;

      return '#' + r + g + b;
    } else {
      return 'Invalid input color';
    }
  }
  /**
   * Call superclass method.
   */
  HSLAToHex() {
    super.convertCode();
    super.copyString();
  }
}
/** @type {object} */
const convertHSLAToHex = new HSLAToHex(
  'convert-button-hshx',
  'output-hshx',
  'copy-hshx',
  'hsla-hx'
);

// ---
/**
 * Convert HSLA to RGBA.
 * @extends {ColorConverter}
 */
class HSLAToRGBA extends ColorConverter {
  constructor(convertButton, output, copy, colorType) {
    super(convertButton, output, copy, colorType);
    this.HSLAToRGBA();
  }

  /**
   * Method to convert HSLA to RGBA.
   * @param {string} hsla
   */
  _method(hslarg) {
    let ex1 =
      /^hsla\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)(((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2},\s?)|((\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}\s\/\s))((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
    let ex2 =
      /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;
    if (ex1.test(hslarg)) {
      let sep = hslarg.indexOf(',') > -1 ? ',' : ' ';
      hslarg = hslarg.substr(5).split(')')[0].split(sep);

      // strip the slash if using space-separated syntax
      if (hslarg.indexOf('/') > -1) hslarg.splice(3, 1);

      this.isPct = this.isPct === true;

      // must be fractions of 1
      let h = hslarg[0],
        s = hslarg[1].substr(0, hslarg[1].length - 1) / 100,
        l = hslarg[2].substr(0, hslarg[2].length - 1) / 100,
        a = hslarg[3];

      // strip label and convert to degrees (if necessary)
      if (h.indexOf('deg') > -1) h = h.substr(0, h.length - 3);
      else if (h.indexOf('rad') > -1)
        h = Math.round((h.substr(0, h.length - 3) / (2 * Math.PI)) * 360);
      else if (h.indexOf('turn') > -1)
        h = Math.round(h.substr(0, h.length - 4) * 360);
      if (h >= 360) h %= 360;

      let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

      if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      let pctFound = a.indexOf('%') > -1;

      if (this.isPct) {
        r = +((r / 255) * 100).toFixed(0);
        g = +((g / 255) * 100).toFixed(0);
        b = +((b / 255) * 100).toFixed(0);
        if (!pctFound) {
          a *= 100;
        } else {
          a = a.substr(0, a.length - 1);
        }
      } else if (pctFound) {
        a = a.substr(0, a.length - 1) / 100;
      }

      return (
        'rgba(' +
        (this.isPct
          ? r + '%, ' + g + '%, ' + b + '%, ' + a + '%'
          : +r + ', ' + +g + ', ' + +b + ', ' + +a) +
        ')'
      );
    } else if (ex2.test(hslarg)) {
      let sep = hslarg.indexOf(',') > -1 ? ',' : ' ';
      hslarg = hslarg.substr(4).split(')')[0].split(sep);
      this.isPct = this.isPct === true;

      let h = hslarg[0],
        s = hslarg[1].substr(0, hslarg[1].length - 1) / 100,
        l = hslarg[2].substr(0, hslarg[2].length - 1) / 100;

      // strip label and convert to degrees (if necessary)
      if (h.indexOf('deg') > -1) h = h.substr(0, h.length - 3);
      else if (h.indexOf('rad') > -1)
        h = Math.round((h.substr(0, h.length - 3) / (2 * Math.PI)) * 360);
      else if (h.indexOf('turn') > -1)
        h = Math.round(h.substr(0, h.length - 4) * 360);
      // keep hue fraction of 360 if ending up over
      if (h >= 360) h %= 360;

      let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

      if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      if (this.isPct) {
        r = +((r / 255) * 100).toFixed(1);
        g = +((g / 255) * 100).toFixed(1);
        b = +((b / 255) * 100).toFixed(1);
      }

      return (
        'rgba(' +
        (this.isPct
          ? r + '%, ' + g + '%, ' + b + '%'
          : +r + ', ' + +g + ', ' + +b + ', 1') +
        ')'
      );
    } else {
      return 'Invalid input color';
    }
  }
  /**
   * Call superclass method.
   */
  HSLAToRGBA() {
    super.convertCode();
    super.copyString();
  }
}
/** @type {object} */
const convertHSLAToRGBA = new HSLAToRGBA(
  'convert-button-hsrg',
  'output-hsrg',
  'copy-hsrg',
  'hsla-rg'
);
