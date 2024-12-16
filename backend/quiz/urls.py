from django.urls import path
from .views import ListCreateQuiz, RetriveUpdateDestroyQuiz, QuizQuestion, QuizQuestionDetail


urlpatterns = [
    path("", ListCreateQuiz.as_view(), name="quiz_list"),
    path("<int:quiz_id>/", RetriveUpdateDestroyQuiz.as_view(), name="quiz_detail"),
    path("question/quiz/<int:quiz_id>/", QuizQuestion.as_view(), name="questions"),
    path("question/<int:pk>/", QuizQuestionDetail.as_view(), name="question_detail"),
]
