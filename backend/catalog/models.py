from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class DoramaManager(models.Manager):
    def recent(self):
        return self.order_by('-release_year')

class Dorama(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image_url = models.URLField(max_length=500, blank=True, null=True)
    release_year = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='doramas')
    cast = models.JSONField(default=list, blank=True)
    
    objects = DoramaManager()

    def __str__(self):
        return self.title

class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Review(models.Model):
    dorama = models.ForeignKey(Dorama, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} on {self.dorama.title}"

class Bookmark(models.Model):
    STATUS_CHOICES = [
        ('favorite', 'Избранное'),
        ('watching', 'Смотрю'),
        ('watched', 'Просмотрено'),
        ('planned', 'В планах'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    dorama = models.ForeignKey(Dorama, on_delete=models.CASCADE, related_name='bookmarks')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'dorama')

    def __str__(self):
        return f"{self.user.username} - {self.dorama.title} ({self.status})"
