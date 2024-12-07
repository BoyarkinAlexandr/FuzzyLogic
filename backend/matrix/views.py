import numpy as np
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def maxmin_composition(A, B):
    steps = []
    result = np.zeros((len(A), len(B[0])))
    for i in range(len(A)):
        for j in range(len(B[0])):
            step = [min(A[i][k], B[k][j]) for k in range(len(A[i]))]
            result[i][j] = max(step)
            steps.append(f"Шаг {i+1}-{j+1}: Мин. по строкам и столбцам = {step}, Макс. = {max(step)}")
    return result, steps

def minmax_composition(A, B):
    result = np.zeros((A.shape[0], B.shape[1]))
    for i in range(A.shape[0]):
        for j in range(B.shape[1]):
            result[i, j] = np.min(np.maximum(A[i, :], B[:, j]))
    return result

def maxmultiplicative_composition(A, B):
    result = np.zeros((A.shape[0], B.shape[1]))
    for i in range(A.shape[0]):
        for j in range(B.shape[1]):
            result[i, j] = np.max(A[i, :] * B[:, j])
    return result

@csrf_exempt
def compute_composition(request):
    try:
        data = json.loads(request.body)
        A = np.array(data['matrixA'], dtype=float)
        B = np.array(data['matrixB'], dtype=float)
    except (KeyError, json.JSONDecodeError) as e:
        return JsonResponse({'error': 'Invalid data format or missing matrices.'}, status=400)

    # Получаем результаты для всех трех типов композиции
    result_maxmin, steps_maxmin = maxmin_composition(A, B)
    result_minmax = minmax_composition(A, B)
    result_maxmult = maxmultiplicative_composition(A, B)

    # Возвращаем результат всех трех вычислений
    return JsonResponse({
        'maxmin_composition': result_maxmin.tolist(),
        'minmax_composition': result_minmax.tolist(),
        'maxmultiplicative_composition': result_maxmult.tolist(),
        'steps_maxmin': steps_maxmin
    })
