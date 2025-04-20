from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer

from djoser.serializers import UserSerializer as BaseUserSerializer


User = get_user_model()


class CreateUserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password', 'is_staff']
        read_only_fields = ['is_staff']



class CustomUserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'is_staff']