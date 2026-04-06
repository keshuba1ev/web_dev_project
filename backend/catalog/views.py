from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Dorama, Review, Category
from .serializers import (
    DoramaSerializer, 
    ReviewSerializer, 
    LoginSerializer, 
    DoramaFilterSerializer,
    CategorySerializer
)

# 1. FBV (Function-Based View): Login
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 2. FBV: Dorama filter
@api_view(['GET'])
@permission_classes([AllowAny])
def dorama_filter_view(request):
    serializer = DoramaFilterSerializer(data=request.query_params)
    if serializer.is_valid():
        doramas = Dorama.objects.all()
        year = serializer.validated_data.get('release_year')
        query = serializer.validated_data.get('query')
        if year:
            doramas = doramas.filter(release_year=year)
        if query:
            doramas = doramas.filter(title__icontains=query)
        res_serializer = DoramaSerializer(doramas, many=True)
        return Response(res_serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 3. CBV: Dorama List
class DoramaList(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        doramas = Dorama.objects.all()
        serializer = DoramaSerializer(doramas, many=True)
        return Response(serializer.data)

class CategoryList(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

# 4. CBV: Full CRUD operations for Review
class ReviewCRUDView(APIView):
    permission_classes = [IsAuthenticated]

    # READ
    def get(self, request, pk=None):
        if pk:
            try:
                review = Review.objects.get(pk=pk)
                serializer = ReviewSerializer(review)
                return Response(serializer.data)
            except Review.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    # CREATE
    def post(self, request):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            # Link to the authenticated user
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # UPDATE
    def put(self, request, pk):
        try:
            review = Review.objects.get(pk=pk, user=request.user)
        except Review.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = ReviewSerializer(review, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    def delete(self, request, pk):
        try:
            review = Review.objects.get(pk=pk, user=request.user)
            review.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Review.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
