from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
from openai import OpenAI


client = OpenAI(api_key=settings.OPENAI_API_KEY)

@csrf_exempt
def chatbot(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        messages = data.get('messages', '')

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=100,
        )

        return JsonResponse(
            {
                'message': response.choices[0].message.content
            }
        )

    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
