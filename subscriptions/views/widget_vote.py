from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def widget_vote_view(request):
    return Response("Not implemented yet", status=501)
