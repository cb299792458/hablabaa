from django.db import models


class Apple(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=100)
    photo_url = models.URLField()

    def __str__(self):
        return self.name

class Conversation(models.Model):
    userName = models.CharField(max_length=100)
    botName = models.CharField(max_length=100)
    practiceLanguage = models.CharField(max_length=100)
    preferredLanguage = models.CharField(max_length=100)
    startedAt = models.DateTimeField(auto_now_add=True)
    email = models.CharField(max_length=100)

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)
    fromUser = models.BooleanField()
    source = models.CharField(max_length=100)
    target = models.CharField(max_length=100)
    text = models.TextField()
    translation = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)

