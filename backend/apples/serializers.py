from .models import Apple, Conversation
from typing import Iterable, List, Dict, Any
from rest_framework import serializers


def serialize_apples(apples: Iterable[Apple]) -> List[Dict[str, Any]]:
    data = []
    for apple in apples:
        data.append({
            'name': apple.name,
            'color': apple.color,
            'photo_url': apple.photo_url,
        })
    return data

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['userId', 'userName', 'botName', 'practiceLanguage', 'preferredLanguage', 'startedAt']

def serialize_conversations(conversations: Iterable[Conversation]) -> List[Dict[str, Any]]:
    data = []
    for conversation in conversations:
        data.append({
            'userId': conversation.userId,
            'userName': conversation.userName,
            'botName': conversation.botName,
            'practiceLanguage': conversation.practiceLanguage,
            'preferredLanguage': conversation.preferredLanguage,
            'startedAt': conversation.startedAt,
        })
    return data
