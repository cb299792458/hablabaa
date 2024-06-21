from .models import Apple, Conversation
from .serializers import serialize_apples, serialize_conversations, ConversationSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view

def apple_list(request):
    apples = Apple.objects.all()
    return JsonResponse(serialize_apples(apples), safe=False)

@csrf_exempt
@api_view(['GET', 'POST'])
def conversation_list(request):
    if request.method == 'GET':
        conversations = Conversation.objects.all()
        return JsonResponse(serialize_conversations(conversations), safe=False)
    elif request.method == 'POST':
        print(request)
        serializer = ConversationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
