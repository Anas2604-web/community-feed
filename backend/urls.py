"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from core.views import leaderboard, feed, post_comments, like_post, like_comment

urlpatterns = [
    path("admin/", admin.site.urls),
    path("leaderboard/", leaderboard),
    path("feed/", feed),
    path("posts/<int:post_id>/comments/", post_comments),
    path("like/post/<int:post_id>/", like_post),
    path("like/comment/<int:comment_id>/", like_comment),


]

