from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import RSVP
import json

def home(request):
    return render(request, 'index.html')

def submit_rsvp(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        rsvp = RSVP(
            name=data.get('name'),
            phone=data.get('phone'),
            guests=data.get('guests'),
            wishes=data.get('wishes', '')
        )
        rsvp.save()
        return JsonResponse({'message': 'Thank you! Your response has been noted.'})
    return JsonResponse({'error': 'Invalid request'}, status=400)



