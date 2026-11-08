# Copyright 2026 IT Power Consulting
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl-3.0).
{
    'name': 'IT Power Arabic Backend Theme',
    'summary': 'An Arabic-first (RTL) backend theme for Odoo Community: '
               'apps sidebar, full-screen apps menu with search, brand colors '
               'and the IBM Plex Sans Arabic font.',
    'version': '17.0.1.0.0',
    'category': 'Themes/Backend',
    'license': 'LGPL-3',
    'author': 'IT Power Consulting',
    'maintainer': 'IT Power Consulting',
    'support': 'info@itpowerconsulting.com',
    'depends': [
        'web',
        'base_setup',
    ],
    'excludes': [
        'web_enterprise',
    ],
    'data': [
        'views/webclient_templates.xml',
        'views/res_config_settings_views.xml',
    ],
    'assets': {
        'web._assets_primary_variables': [
            ('prepend', 'itpower_arabic_theme/static/src/scss/primary_variables.scss'),
        ],
        'web.assets_backend': [
            'itpower_arabic_theme/static/src/scss/fonts.scss',
            'itpower_arabic_theme/static/src/scss/theme.scss',
            'itpower_arabic_theme/static/src/webclient/**/*.scss',
            'itpower_arabic_theme/static/src/webclient/**/*.js',
            'itpower_arabic_theme/static/src/webclient/**/*.xml',
        ],
    },
    'images': [
        'static/description/banner.png',
        'static/description/theme_screenshot.png',
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}
