from .baseconf import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("DJANGO_TOUR_SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["tour-up.ru"]

CORS_ALLOWED_ORIGINS = [
    "https://tour-up.ru",
    "http://tour-up.ru:3000"
]

