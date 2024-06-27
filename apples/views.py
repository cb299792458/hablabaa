from .models import Apple, Conversation, Message
from .serializers import serialize_apples, serialize_conversations, ConversationSerializer, MessageSerializer, serialize_messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view

def apple_list(request):
    apples = Apple.objects.all()
    return JsonResponse(serialize_apples(apples), safe=False)

@csrf_exempt
@api_view(['GET'])
def conversation_list(request):
    if request.method == 'GET':
        email = request.query_params.get('email')
        if email:
            conversations = Conversation.objects.filter(email=email)
            return JsonResponse(serialize_conversations(conversations), safe=False)
        return JsonResponse({'error': 'email parameter is required'}, status=400)
    
@csrf_exempt
@api_view(['GET', 'POST'])
def conversation(request):
    if request.method == 'GET':
        id = request.query_params.get('id')
        if id:
            conversations = Conversation.objects.filter(id=id)
            return JsonResponse(serialize_conversations(conversations)[0], safe=False)
        return JsonResponse({'error': 'id parameter is required'}, status=400)
    elif request.method == 'POST':
        serializer = ConversationSerializer(data=request.data)
        if serializer.is_valid():
            new_conversation = serializer.save()
            response = serializer.data
            response['id'] = new_conversation.id
            return JsonResponse(response, status=201)
        return JsonResponse(serializer.errors, status=400)

@csrf_exempt
@api_view(['GET', 'POST'])
def message(request):
    if request.method == 'GET':
        conversation_id = request.query_params.get('conversationId')
        if conversation_id:
            messages = Message.objects.filter(conversation=conversation_id)
            return JsonResponse(serialize_messages(messages), safe=False)
        return JsonResponse({'error': 'conversation_id parameter is required'}, status=400)
    elif request.method == 'POST':
        conversation_id = request.data.get('conversationId')
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            print('Conversation not found', conversation_id)
            return JsonResponse({'error': 'Conversation not found'}, status=404)
        
        message = Message(
            conversation=conversation, 
            fromUser=request.data.get('fromUser'), 
            source=request.data.get('source'), 
            target=request.data.get('target'), 
            text=request.data.get('text'), 
            translation=request.data.get('translation')
        )
        message.save()
        serializer = MessageSerializer(message)
        return JsonResponse(serializer.data, status=201)
    return JsonResponse({'error': 'Method not allowed'}, status=405)
