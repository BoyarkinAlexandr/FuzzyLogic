from django.db import models

class Video(models.Model):
    url = models.URLField(max_length=200)
    topic = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Video for {self.topic}: {self.url}"