/** @odoo-module **/
// Copyright 2026 IT Power Consulting
// License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0).

import { useState } from "@odoo/owl";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { NavBar } from "@web/webclient/navbar/navbar";
import { WebClient } from "@web/webclient/webclient";
import { ItpAppsBar } from "./appsbar/appsbar";
import { ItpAppsMenu } from "./appsmenu/appsmenu";

WebClient.components = { ...WebClient.components, ItpAppsBar, ItpAppsMenu };

patch(NavBar.prototype, {
    setup() {
        super.setup();
        this.itpTheme = useService("itp_theme");
        this.itpThemeState = useState(this.itpTheme.state);
    },
});
