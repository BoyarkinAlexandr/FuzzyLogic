# backend/fuzzy_operations/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .operations import (
    fuzzy_union,
    fuzzy_intersection,
    fuzzy_difference,
    fuzzy_complement,
    fuzzy_concentration,
)

@api_view(['POST'])
def fuzzy_calculate(request):
    sets = request.data.get('sets', [])
    operation = request.data.get('operation')
    alpha = request.data.get('alpha', None)

    if not operation or not sets:
        return Response({'error': 'Operation and at least one set are required'}, status=status.HTTP_400_BAD_REQUEST)

    result = {}

    if operation == 'union':
        result = fuzzy_union(sets)

    elif operation == 'intersection':
        result = fuzzy_intersection(sets)

    elif operation == 'difference':
        result = fuzzy_difference(sets)

    elif operation == 'complement':
        result = fuzzy_complement(sets[0])

    elif operation == 'concentration':
        result = fuzzy_concentration(sets[0])

    return Response({'result': result})