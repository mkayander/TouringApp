from django.contrib.auth.decorators import login_required
from django.http import HttpRequest
from django.shortcuts import render


@login_required
def index(request: HttpRequest):
    return render(request, "react/index.html")
