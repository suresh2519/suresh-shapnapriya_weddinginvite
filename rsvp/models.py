from django.db import models

class RSVP(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    guests = models.CharField(max_length=10)
    wishes = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
