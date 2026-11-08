/** @odoo-module **/
// Copyright 2026 IT Power Consulting
// License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0).

import { reactive } from "@odoo/owl";
import { browser } from "@web/core/browser/browser";
import { registry } from "@web/core/registry";

const SIDEBAR_KEY = "itpower_arabic_theme.sidebar_expanded";

function readExpanded() {
    try {
        return browser.localStorage.getItem(SIDEBAR_KEY) === "1";
    } catch {
        return false;
    }
}

/**
 * Small shared state for the theme: whether the full-screen apps menu is
 * open and whether the apps sidebar shows the app names.
 */
export const itpThemeService = {
    start(env) {
        const state = reactive({
            appsMenuOpen: false,
            sidebarExpanded: readExpanded(),
        });
        // Close the apps menu as soon as an action is displayed.
        env.bus.addEventListener("ACTION_MANAGER:UI-UPDATED", () => {
            state.appsMenuOpen = false;
        });
        return {
            state,
            toggleAppsMenu(open = !state.appsMenuOpen) {
                state.appsMenuOpen = open;
            },
            toggleSidebar() {
                state.sidebarExpanded = !state.sidebarExpanded;
                try {
                    browser.localStorage.setItem(SIDEBAR_KEY, state.sidebarExpanded ? "1" : "0");
                } catch {
                    // Private windows can refuse storage; the toggle still works.
                }
            },
        };
    },
};

registry.category("services").add("itp_theme", itpThemeService);
