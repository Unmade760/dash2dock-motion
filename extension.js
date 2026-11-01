// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-
// This file is part of Dash2Dock Motion, a modified copy of Dash to Dock
// (https://github.com/micheleg/dash-to-dock) by Michele Gaio and
// contributors. Distributed under the GNU General Public License,
// version 2 or later.

import {DockManager} from './docking.js';
import {Extension} from './dependencies/shell/extensions/extension.js';

// We export this so it can be accessed by other extensions
export let dockManager;

export default class ContentDockExtension extends Extension.Extension {
    enable() {
        // TODO: Remove this when upstream will disable extensions on shutdown
        // See: https://gitlab.gnome.org/GNOME/gnome-shell/-/merge_requests/4214
        this._shutdownID = global.connect('shutdown', () => this.disable());
        dockManager = new DockManager(this);
    }

    disable() {
        global.disconnect(this._shutdownID);
        delete this._shutdownID;
        dockManager?.destroy();
        dockManager = null;
    }
}
