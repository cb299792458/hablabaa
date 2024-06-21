from django.db import models


class Apple(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=100)
    photo_url = models.URLField()

    def __str__(self):
        return self.name

class Conversation(models.Model):
    userId = models.CharField(max_length=100)
    userName = models.CharField(max_length=100)
    botName = models.CharField(max_length=100)
    practiceLanguage = models.CharField(max_length=100)
    preferredLanguage = models.CharField(max_length=100)
    startedAt = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'{self.userName}\'s conversation with {self.botName} in {self.practiceLanguage} from {self.startedAt}'
