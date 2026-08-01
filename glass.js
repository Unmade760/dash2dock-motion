// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-
//
// Style classes for the translucent dock slab. The backdrop blur is not drawn
// here, it is left to Blur my Shell's dash blur, which imposes two constraints
// on this file.
//
// Blur my Shell locates the slab by comparing the style class for equality
// against 'dash-background' (see its components/dash_to_dock.js), so adding a
// class to dash._background breaks the lookup and it logs "giving up dash blur
// setup before allocation". Every class defined here therefore goes on the dock
// container and the stylesheet reaches the slab through descendant selectors.
// The dash actor is unusable for the same reason: Blur my Shell replaces its
// style class with 'transparent-dash' when it overrides the background.
//
// Blur my Shell also gives up when the dock has no allocation yet. It retries
// on BEFORE_REDRAW laters and stops after 30 attempts, while the dock starts at
// opacity 0 and defers initialization to the stage's after-paint, so at login
// the allocation may or may not land inside that budget. _rearmBlur() re-adds
// the dock to uiGroup once it does have an allocation, which re-emits the
// 'child-added' signal Blur my Shell listens on.

import GLib from 'gi://GLib';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const BLUR_MY_SHELL_UUID = 'blur-my-shell@aunetx';

/** Long enough that Blur my Shell has either succeeded or spent its retries. */
const BLUR_REARM_DELAY_MS = 2500;

export const GLASS_STYLE_CLASS = 'dash2dock-motion-glass';
export const OUTLINE_STYLE_CLASS = 'dash2dock-motion-glass-outline';
export const NO_HIGHLIGHT_STYLE_CLASS = 'dash2dock-motion-no-highlight';

/** Name Blur my Shell gives the blurred background actor it injects. */
export const BLUR_GROUP_NAME = 'bms-dash-backgroundgroup';

export class GlassSlab {
    /**
     * @param {DockDash} dash the dock's dash
     * @param {DashToDock} dock the dock container (#dashtodockContainer)
     * @param {Gio.Settings} settings the dock's settings
     */
    constructor(dash, dock, settings) {
        this._dash = dash;
        this._dock = dock;
        this._settings = settings;

        this._dock.add_style_class_name(GLASS_STYLE_CLASS);

        this._signalIds = [
            settings.connect('changed::glass-outline',
                () => this._syncOutline()),
            settings.connect('changed::show-icon-highlight',
                () => this._syncHighlight()),
        ];
        this._syncOutline();
        this._syncHighlight();

        this._rearmBlurId = GLib.timeout_add(GLib.PRIORITY_DEFAULT,
            BLUR_REARM_DELAY_MS, () => {
                this._rearmBlurId = 0;
                this._rearmBlur();
                return GLib.SOURCE_REMOVE;
            });
    }

    /**
     * Re-add the dock to uiGroup if Blur my Shell is running but never managed
     * to blur us, so it gets a second chance now that the dock has a size.
     */
    _rearmBlur() {
        if (Main.extensionManager.lookup(BLUR_MY_SHELL_UUID)?.state !== 1)
            return;

        if (!this._dash.has_allocation())
            return;

        const alreadyBlurred = this._dash.get_parent()?.get_children().some(
            child => child.get_name() === BLUR_GROUP_NAME);
        if (alreadyBlurred)
            return;

        this._dock._trackDock();
    }

    _syncOutline() {
        if (this._settings.get_boolean('glass-outline'))
            this._dock.add_style_class_name(OUTLINE_STYLE_CLASS);
        else
            this._dock.remove_style_class_name(OUTLINE_STYLE_CLASS);
    }

    _syncHighlight() {
        if (this._settings.get_boolean('show-icon-highlight'))
            this._dock.remove_style_class_name(NO_HIGHLIGHT_STYLE_CLASS);
        else
            this._dock.add_style_class_name(NO_HIGHLIGHT_STYLE_CLASS);
    }

    destroy() {
        if (this._rearmBlurId) {
            GLib.Source.remove(this._rearmBlurId);
            this._rearmBlurId = 0;
        }

        for (const id of this._signalIds)
            this._settings.disconnect(id);
        this._signalIds = [];
        if (this._dock) {
            this._dock.remove_style_class_name(GLASS_STYLE_CLASS);
            this._dock.remove_style_class_name(OUTLINE_STYLE_CLASS);
            this._dock.remove_style_class_name(NO_HIGHLIGHT_STYLE_CLASS);
        }
        this._dash = null;
        this._dock = null;
        this._settings = null;
    }
}
