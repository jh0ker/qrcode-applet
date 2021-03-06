/*
 * QR.js
 * contains QR class
 * part of clipboard-qr@ebbes applet
 */
const Lang = imports.lang;
const Clutter = imports.gi.Clutter;
const St = imports.gi.St;

const AppletDir = imports.ui.appletManager.applets["clipboard-qr@ebbes"];
const QRLibrary = AppletDir.QRLib;

let QR_Background = new Clutter.Color();
QR_Background.from_string('#fff');
let QR_Foreground = new Clutter.Color();
QR_Foreground.from_string('#000');

const QR_Blocksize = 5;

function QR(width, height, parent) {
    this._init(width, height, parent);
}

QR.prototype = {
    _init: function(size, parent) {
        this.actor = new St.DrawingArea({reactive: false});
        this.parent = parent;
        this.size = size;
        this.actor.set_width(size);
        this.actor.set_height(size);
        this._qrdata = {};
        this.error = '';
        this.actor.connect('repaint', Lang.bind(this, this._draw));
    },
    _draw: function() {
        let [width, height] = this.actor.get_surface_size();
        let context = this.actor.get_context();
        
        //clear drawing area
        //Clutter.cairo_set_source_color(context, QR_Background);
        context.setSourceRGBA(1.0, 1.0, 1.0, 0.9);
        context.rectangle(0, 0, width, height);
        context.fill();
        
        if (!this._qrdata)
            return;
        
        //draw qr code
        //Clutter.cairo_set_source_color(context, QR_Foreground);
        context.setSourceRGBA(0.0, 0.0, 0.0, 0.9);
        let length = this._qrdata.length;

        for (let i = 0; i < length; ++i) {
            for (let j = 0; j < length; ++j) {
                if (this._qrdata[i][j]) {
                    context.rectangle(QR_Blocksize * (j + 1), QR_Blocksize * (i + 1), QR_Blocksize, QR_Blocksize);
                    context.fill();
                }
            }
        }
    },
    _resize: function(size) {
        this.size = size;
        this.actor.set_width(size);
        this.actor.set_height(size);
    },
    set_text: function(text) {
        try {
            this._qrdata = QRLibrary.qr_generate(text, {});
            this.error = 'QR generated.';
            this._resize((this._qrdata.length + 2) * QR_Blocksize);
        }
        catch (e) {
            this.error = e;
            this._qrdata = {};
            this._resize(0);
        }
    }
};

