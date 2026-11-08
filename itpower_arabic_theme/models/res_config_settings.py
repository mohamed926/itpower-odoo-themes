# Copyright 2026 IT Power Consulting
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0).
from odoo import fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    itp_color_brand = fields.Char(related='company_id.itp_color_brand', readonly=False)
    itp_color_sidebar = fields.Char(related='company_id.itp_color_sidebar', readonly=False)
    itp_color_primary = fields.Char(related='company_id.itp_color_primary', readonly=False)
    itp_color_accent = fields.Char(related='company_id.itp_color_accent', readonly=False)
    itp_apps_background = fields.Binary(related='company_id.itp_apps_background', readonly=False)
    itp_favicon = fields.Binary(related='company_id.itp_favicon', readonly=False)

    def action_itp_reset_theme(self):
        self.company_id.itp_reset_theme()
        return {'type': 'ir.actions.client', 'tag': 'reload'}
