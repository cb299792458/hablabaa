from .models import Apple, Conversation, Message
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
        fields = [
            'userName',
            'botName', 
            'practiceLanguage', 
            'preferredLanguage', 
            'startedAt',
            'email',
        ]

def serialize_conversations(conversations: Iterable[Conversation]) -> List[Dict[str, Any]]:
    data = []
    for conversation in conversations:
        data.append({
            'userName': conversation.userName,
            'botName': conversation.botName,
            'practiceLanguage': conversation.practiceLanguage,
            'preferredLanguage': conversation.preferredLanguage,
            'startedAt': conversation.startedAt,
            'email': conversation.email,
            'id': conversation.id,
        })
    return data

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = [
            'conversation',
            'fromUser',
            'source',
            'target',
            'text',
            'translation',
            'createdAt',
        ]
    conversation = ConversationSerializer()

def serialize_messages(messages: Iterable[Message]) -> List[Dict[str, Any]]:
    data = []
    for message in messages:
        data.append({
            'conversationId': message.conversation_id,
            'fromUser': message.fromUser,
            'source': message.source,
            'target': message.target,
            'text': message.text,
            'translation': message.translation,
            'createdAt': message.createdAt,
        })
    return data
