# Generated by Django 5.0.6 on 2024-06-21 18:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apples', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userId', models.CharField(max_length=100)),
                ('userName', models.CharField(max_length=100)),
                ('botName', models.CharField(max_length=100)),
                ('practiceLanguage', models.CharField(max_length=100)),
                ('preferredLanguage', models.CharField(max_length=100)),
                ('startedAt', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]