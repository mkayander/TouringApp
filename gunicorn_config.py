command = '/home/www/projects/TouringApp/env/bin/gunicorn'
pythonpath = '/home/www/projects/TouringApp/project/'
bind = 'unix:/home/www/projects/TouringApp/cloud.sock'
workers = 5
user = 'www'
uid = 'www-data'
gid = 'www-data'
# group = 'www-data'
# error-logfile = '-'
limit_request_fields = 32000
limit_request_field_size = 0
chmod_socket = 777
raw_env = 'DJANGO_SETTINGS_MODULE=project.settings-prod'
