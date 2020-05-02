from django.urls import reverse
from rest_framework.decorators import api_view


@api_view(["GET"])
def get_widgets(*args, **kwargs):
    return {
        "main": reverse("widget_timeline"),
        "mandatory": [
            reverse("widget_" + name)
            for name in ["birthday", "poll", "vote", "repartition", "balance"]
        ],
        "optional": [reverse("widget_" + name) for name in ["marketplace", "library"]],
        # Fails because `widget_marketplace` requires a `marketplace_id` as a parameter…
    }
