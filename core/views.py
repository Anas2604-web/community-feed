from django.shortcuts import render
from datetime import timedelta
from django.utils.timezone import now
from django.db.models import Sum, Count
from django.http import JsonResponse

from .models import KarmaTransaction, Post, Comment


def leaderboard(request):
    last_24_hours = now() - timedelta(hours=24)

    data = (
        KarmaTransaction.objects
        .filter(created_at__gte=last_24_hours)
        .values("user__username")
        .annotate(total_karma=Sum("points"))
        .order_by("-total_karma")[:5]
    )

    result = [
        {
            "user": row["user__username"],
            "karma": row["total_karma"]
        }
        for row in data
    ]

    return JsonResponse(result, safe=False)


def feed(request):
    posts = (
        Post.objects
        .select_related("author")
        .annotate(like_count=Count("like"))
        .order_by("-created_at")
    )

    result = [
        {
            "id": post.id,
            "author": post.author.username,
            "content": post.content,
            "likes": post.like_count,
            "created_at": post.created_at,
        }
        for post in posts
    ]

    return JsonResponse(result, safe=False)



def post_comments(request, post_id):
    comments = (
        Comment.objects
        .filter(post_id=post_id)
        .select_related("author")
        .order_by("created_at")
    )

    comment_map = {}
    roots = []

    for comment in comments:
        comment_map[comment.id] = {
            "id": comment.id,
            "author": comment.author.username,
            "content": comment.content,
            "created_at": comment.created_at,
            "replies": [],
            "parent_id": comment.parent_id,
        }

    for comment_id, data in comment_map.items():
        parent_id = data["parent_id"]

        if parent_id:
            comment_map[parent_id]["replies"].append(data)
        else:
            roots.append(data)

        del data["parent_id"]

    return JsonResponse(roots, safe=False)
