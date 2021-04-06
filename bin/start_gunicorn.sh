#!/bin/bash
source /home/www/projects/TouringApp/env/bin/activate
exec gunicorn -c "/home/www/projects/TouringApp/gunicorn_config.py" project.wsgi
