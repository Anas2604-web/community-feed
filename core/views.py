from django.shortcuts import render
from datetime import timedelta
from django.utils.timezone import now
from django.db.models import Sum
from django.http import JsonResponse

from .models import KarmaTransaction


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
