# Copyright 2026 IT Power Consulting
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0).
import base64

from odoo import http
from odoo.http import request
from odoo.tools import file_open

DEFAULTS = {
    'itp_apps_background': ('itpower_arabic_theme/static/src/img/apps_background.png', 'image/png'),
    'itp_favicon': ('web/static/img/favicon.ico', 'image/x-icon'),
}


class ItpThemeController(http.Controller):

    def _itp_image(self, field):
        company = request.env.company.sudo()
        data = company[field]
        if data:
            raw = base64.b64decode(data)
            stream_type = 'image/x-icon' if raw[:4] == b'\x00\x00\x01\x00' else None
            if not stream_type:
                stream_type = 'image/svg+xml' if raw.lstrip()[:1] == b'<' else 'image/png'
                if raw[:3] == b'\xff\xd8\xff':
                    stream_type = 'image/jpeg'
        else:
            path, stream_type = DEFAULTS[field]
            with file_open(path, 'rb') as f:
                raw = f.read()
        return request.make_response(raw, headers=[
            ('Content-Type', stream_type),
            ('Cache-Control', 'private, max-age=3600'),
        ])

    @http.route('/itpower_arabic_theme/apps_background', type='http', auth='user')
    def apps_background(self, **kw):
        return self._itp_image('itp_apps_background')

    @http.route('/itpower_arabic_theme/favicon', type='http', auth='user')
    def favicon(self, **kw):
        return self._itp_image('itp_favicon')
