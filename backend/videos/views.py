from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Video
from .serializers import VideoSerializer

# Получение списка видео по теме
class VideoListView(generics.ListAPIView):
    serializer_class = VideoSerializer

    def get_queryset(self):
        topic = self.kwargs['topic']
        return Video.objects.filter(topic=topic)

# Добавление видео
class AddVideoView(APIView):
    def post(self, request, topic):
        url = request.data.get('url')
        if not url:
            return Response({'error': 'URL is required'}, status=400)
        video = Video.objects.create(url=url, topic=topic)
        serializer = VideoSerializer(video)
        videos = Video.objects.filter(topic=topic)
        return Response({'videos': VideoSerializer(videos, many=True).data})

# Удаление видео
class DeleteVideoView(APIView):
    def post(self, request, topic):
        video_id = request.data.get('id')
        if video_id is None:
            return Response({'error': 'Video ID is required'}, status=400)
        try:
            video = Video.objects.get(id=video_id, topic=topic)
            video.delete()
            videos = Video.objects.filter(topic=topic)
            return Response({'videos': VideoSerializer(videos, many=True).data})
        except Video.DoesNotExist:
            return Response({'error': 'Video not found'}, status=404)