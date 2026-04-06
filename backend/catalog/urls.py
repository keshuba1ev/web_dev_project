from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('doramas/', views.DoramaList.as_view(), name='dorama-list'),
    path('categories/', views.CategoryList.as_view(), name='category-list'),
    path('doramas/filter/', views.dorama_filter_view, name='dorama-filter'),
    path('reviews/', views.ReviewCRUDView.as_view(), name='review-list-create'),
    path('reviews/<int:pk>/', views.ReviewCRUDView.as_view(), name='review-detail'),
]
