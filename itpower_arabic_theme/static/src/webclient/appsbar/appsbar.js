/** @odoo-module **/
// Copyright 2026 IT Power Consulting
// License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0).

import { Component, useState } from "@odoo/owl";
import { useBus, useService } from "@web/core/utils/hooks";
import { getAppIcon, getMenuHref } from "../app_icon";

/** Vertical bar with one button per app, on the reading-start side. */
export class ItpAppsBar extends Component {
    static template = "itpower_arabic_theme.AppsBar";
    static props = {};

    setup() {
        this.menuService = useService("menu");
        this.theme = useService("itp_theme");
        this.themeState = useState(this.theme.state);
        useBus(this.env.bus, "MENUS:APP-CHANGED", () => this.render());
    }

    get apps() {
        const current = this.menuService.getCurrentApp();
        return this.menuService.getApps().map((app) => ({
            id: app.id,
            name: app.name,
            xmlid: app.xmlid,
            href: getMenuHref(app),
            icon: getAppIcon(app),
            active: Boolean(current && current.id === app.id),
            menu: app,
        }));
    }

    iconStyle(icon) {
        return `color: ${icon.color || "#fff"}; background: ${icon.background || "var(--itp-primary)"};`;
    }

    onAppClick(app, ev) {
        if (ev.ctrlKey || ev.metaKey || ev.shiftKey) {
            return; // let the browser open the link in a new tab
        }
        ev.preventDefault();
        this.theme.toggleAppsMenu(false);
        this.menuService.selectMenu(app.menu);
    }
}
