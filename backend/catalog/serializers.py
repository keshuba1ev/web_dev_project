from rest_framework import serializers
from .models import Dorama, Review, Category, Bookmark
from django.contrib.auth.models import User

# ModelSerializers
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class DoramaSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Dorama
        fields = ['id', 'title', 'description', 'image_url', 'release_year', 'category', 'category_name', 'cast']

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Review
        fields = ['id', 'dorama', 'user', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['user']

# Regular Serializers
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)

class DoramaFilterSerializer(serializers.Serializer):
    release_year = serializers.IntegerField(required=False)
    query = serializers.CharField(max_length=100, required=False)
    category = serializers.IntegerField(required=False)

class BookmarkSerializer(serializers.ModelSerializer):
    dorama_details = DoramaSerializer(source='dorama', read_only=True)

    class Meta:
        model = Bookmark
        fields = ['id', 'user', 'dorama', 'dorama_details', 'status', 'created_at']
        read_only_fields = ['user']
