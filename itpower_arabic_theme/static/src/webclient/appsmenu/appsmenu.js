/** @odoo-module **/
// Copyright 2026 IT Power Consulting
// License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0).

import { Component, useEffect, useRef, useState } from "@odoo/owl";
import { _t } from "@web/core/l10n/translation";
import { localization } from "@web/core/l10n/localization";
import { useService } from "@web/core/utils/hooks";
import { getAppIcon, getMenuHref, normalizeSearch } from "../app_icon";

const { DateTime } = luxon;
const MAX_RESULTS = 40;

/** Full-screen apps menu: greeting, search over apps and menus, app grid. */
export class ItpAppsMenu extends Component {
    static template = "itpower_arabic_theme.AppsMenu";
    static props = {};

    setup() {
        this.menuService = useService("menu");
        this.user = useService("user");
        this.theme = useService("itp_theme");
        this.themeState = useState(this.theme.state);
        this.state = useState({ query: "", focus: 0 });
        this.searchRef = useRef("search");

        useEffect(
            (open) => {
                if (open) {
                    this.state.query = "";
                    this.state.focus = 0;
                    this.searchRef.el?.focus();
                }
            },
            () => [this.themeState.appsMenuOpen]
        );
    }

    get greeting() {
        const hour = new Date().getHours();
        if (hour < 12) {
            return _t("Good morning, %s", this.firstName);
        }
        if (hour < 18) {
            return _t("Good afternoon, %s", this.firstName);
        }
        return _t("Good evening, %s", this.firstName);
    }

    get firstName() {
        return (this.user.name || "").split(" ")[0];
    }

    get today() {
        const locale = (localization.code || "en_US").replace("_", "-");
        return DateTime.now()
            .setLocale(locale)
            .reconfigure({ numberingSystem: "latn" })
            .toLocaleString({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
    }

    get apps() {
        return this.menuService.getApps().map((app) => ({
            id: app.id,
            name: app.name,
            xmlid: app.xmlid,
            href: getMenuHref(app),
            icon: getAppIcon(app),
            menu: app,
        }));
    }

    /** Every app and every menu that opens something, with its path. */
    get searchableMenus() {
        const result = [];
        const walk = (menu, app, path) => {
            for (const child of menu.childrenTree || []) {
                const childPath = [...path, child.name];
                if (child.actionID) {
                    result.push({
                        id: child.id,
                        label: childPath.join(" / "),
                        name: child.name,
                        href: getMenuHref(child),
                        icon: getAppIcon(app),
                        menu: child,
                        haystack: normalizeSearch(childPath.join(" ")),
                    });
                }
                walk(child, app, childPath);
            }
        };
        for (const app of this.menuService.getApps()) {
            result.push({
                id: app.id,
                label: app.name,
                name: app.name,
                href: getMenuHref(app),
                icon: getAppIcon(app),
                menu: app,
                haystack: normalizeSearch(app.name),
            });
            walk(this.menuService.getMenuAsTree(app.id), app, [app.name]);
        }
        return result;
    }

    get results() {
        const terms = normalizeSearch(this.state.query).split(/\s+/).filter(Boolean);
        if (!terms.length) {
            return [];
        }
        return this.searchableMenus
            .filter((item) => terms.every((term) => item.haystack.includes(term)))
            .slice(0, MAX_RESULTS);
    }

    iconStyle(icon) {
        return `color: ${icon.color || "#fff"}; background: ${icon.background || "var(--itp-primary)"};`;
    }

    open(item, ev) {
        if (ev && (ev.ctrlKey || ev.metaKey || ev.shiftKey)) {
            return;
        }
        ev?.preventDefault();
        this.theme.toggleAppsMenu(false);
        this.menuService.selectMenu(item.menu);
    }

    onInput() {
        this.state.focus = 0;
    }

    onKeydown(ev) {
        const results = this.results;
        switch (ev.key) {
            case "Escape":
                ev.preventDefault();
                this.theme.toggleAppsMenu(false);
                break;
            case "ArrowDown":
                if (results.length) {
                    ev.preventDefault();
                    this.state.focus = (this.state.focus + 1) % results.length;
                }
                break;
            case "ArrowUp":
                if (results.length) {
                    ev.preventDefault();
                    this.state.focus = (this.state.focus - 1 + results.length) % results.length;
                }
                break;
            case "Enter":
                if (results.length) {
                    ev.preventDefault();
                    this.open(results[this.state.focus] || results[0]);
                }
                break;
        }
    }
}
