import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.core.mail import send_mail
from django.conf import settings


@csrf_exempt
@require_POST
def send_contact_email(request):
    """Handle contact form submissions and send email via SMTP."""
    try:
        data = json.loads(request.body)

        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        email = data.get('email', '').strip()
        service = data.get('service', 'General Inquiry')
        message = data.get('message', '').strip()

        # Validate required fields
        if not first_name or not last_name or not email or not message:
            return JsonResponse(
                {'error': 'All fields are required.'},
                status=400
            )

        # Compose the email
        subject = f'Quince Nutrition - Contact Form: {service}'
        email_body = (
            f"New contact form submission from the Quince Nutrition website:\n\n"
            f"Name: {first_name} {last_name}\n"
            f"Email: {email}\n"
            f"Service Interest: {service}\n\n"
            f"Message:\n{message}\n"
        )

        try:
            send_mail(
                subject=subject,
                message=email_body,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[settings.CONTACT_EMAIL_RECIPIENT],
                fail_silently=False,
            )
        except Exception as e:
            return JsonResponse(
                {'error': f'Failed to send email. Check SMTP settings. Error: {str(e)}'},
                status=500
            )

        return JsonResponse({'success': True, 'message': 'Email sent successfully!'})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data.'}, status=400)
    except Exception as e:
        return JsonResponse(
            {'error': f'Failed to send email: {str(e)}'},
            status=500
        )
