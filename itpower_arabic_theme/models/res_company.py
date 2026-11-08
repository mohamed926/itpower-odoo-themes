# Copyright 2026 IT Power Consulting
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0).
import re

from odoo import _, api, fields, models
from odoo.exceptions import ValidationError

DEFAULT_COLORS = {
    'itp_color_brand': '#17324A',
    'itp_color_sidebar': '#102536',
    'itp_color_primary': '#3F729C',
    'itp_color_accent': '#F28C28',
}

HEX_COLOR = re.compile(r'^#[0-9a-fA-F]{6}$')


class ResCompany(models.Model):
    _inherit = 'res.company'

    itp_color_brand = fields.Char(
        string='Top Bar Color', default=DEFAULT_COLORS['itp_color_brand'])
    itp_color_sidebar = fields.Char(
        string='Sidebar Color', default=DEFAULT_COLORS['itp_color_sidebar'])
    itp_color_primary = fields.Char(
        string='Buttons Color', default=DEFAULT_COLORS['itp_color_primary'])
    itp_color_accent = fields.Char(
        string='Accent Color', default=DEFAULT_COLORS['itp_color_accent'])
    itp_apps_background = fields.Binary(
        string='Apps Menu Background', attachment=True)
    itp_favicon = fields.Binary(
        string='Browser Tab Icon', attachment=True)

    @api.constrains(*DEFAULT_COLORS)
    def _check_itp_colors(self):
        for company in self:
            for fname in DEFAULT_COLORS:
                value = company[fname]
                if value and not HEX_COLOR.match(value):
                    raise ValidationError(_(
                        'The color "%s" must be a hex code like #17324A.', value))

    def _itp_theme_colors(self):
        """Colors used by the theme, falling back to the defaults."""
        self.ensure_one()
        return {
            key: (self[key] if self[key] and HEX_COLOR.match(self[key]) else default)
            for key, default in DEFAULT_COLORS.items()
        }

    def itp_reset_theme(self):
        self.write(dict(DEFAULT_COLORS, itp_apps_background=False, itp_favicon=False))
