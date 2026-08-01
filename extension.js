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
        dockManager = new DockManager(this);
    }

    disable() {
        dockManager?.destroy();
        dockManager = null;
    }
}
