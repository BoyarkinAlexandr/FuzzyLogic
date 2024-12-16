from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Quiz, Question, Answer
from .serializers import QuizSerializer, QuestionSerializer
from rest_framework.views import APIView
from django.http import Http404


class ListCreateQuiz(generics.ListCreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer


class RetriveUpdateDestroyQuiz(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer


class QuizQuestion(APIView):
    def get(self, request, format=None, **kwargs):
        questions = Question.objects.filter(quiz_id=kwargs["quiz_id"])
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)
    

    def post(self, request, format=None, **kwargs):
        quiz = Question.objects.get(id=kwargs["quiz_id"])
        serializer = QuizSerializer(data=request.data)


        if serializer.is_valid():
            serializer.save(quiz=quiz)
            return Response( 
                {"message": "Вопрос успешно создан", "data": serializer.data},
                status= status.HTTP_201_CREATED
                
                )
        

class QuizQuestionDetail(APIView):

    def get_object(self, pk):
        try:
            return Question.objects.get(id=pk)
        except Question.DoesNotExist:
            raise Http404
        
    def get(self, request, pk, format=None):
        question = self.get_object(pk)
        serializer = QuestionSerializer(question)  # Используем QuestionSerializer вместо QuizSerializer
        return Response(serializer.data)
    

    def patch(self, request, pk, format=None):
        question = self.get_object(pk)
        serializer = QuestionSerializer(question, data=request.data, partial=True)  # Используем QuestionSerializer
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def delete(self, request, pk, format=None):
        question = self.get_object(pk)
        question.delete()

        return Response(
                {"message": "Вопрос успешно удалён"},
                status=status.HTTP_204_NO_CONTENT
        )