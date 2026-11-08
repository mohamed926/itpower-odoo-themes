/** @odoo-module **/
// Copyright 2026 IT Power Consulting
// License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0).

/**
 * Returns how to draw an app's icon from the menu data:
 * { src } for an image, { iconClass, color, background } for a font icon,
 * or { letter } as a last resort.
 */
export function getAppIcon(app) {
    if (app.webIconData) {
        const data = String(app.webIconData);
        if (data.startsWith("data:image")) {
            return { src: data };
        }
        const prefix = data.startsWith("P") ? "data:image/svg+xml;base64," : "data:image/png;base64,";
        return { src: prefix + data.replace(/\s/g, "") };
    }
    if (app.webIcon && typeof app.webIcon === "string" && app.webIcon.includes(",")) {
        const [iconClass, color, background] = app.webIcon.split(",");
        if (iconClass && !iconClass.includes("/")) {
            return { iconClass, color, background };
        }
    }
    return { letter: (app.name || "?").trim().charAt(0) };
}

export function getMenuHref(menu) {
    return `/web#menu_id=${menu.id}${menu.actionID ? `&action=${menu.actionID}` : ""}`;
}

/**
 * Normalizes text for searching. Arabic letters that people type
 * interchangeably are folded together (أ إ آ ا, ة ه, ى ي) and diacritics and
 * tatweel are dropped, so "فاتوره" finds "فاتورة".
 */
export function normalizeSearch(text) {
    return String(text || "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[ً-ٰٟـ]/g, "")
        .replace(/[آأإٱ]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/[̀-ͯ]/g, "")
        .trim();
}
