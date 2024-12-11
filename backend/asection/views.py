from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['POST'])
def calculate(request):
    data = request.data
    
    alpha_section_result = sum(data['input_values'])  # Пример
    inclusion_degree_result = len(set(data['sets'][0]).intersection(data['sets'][1])) / len(data['sets'][0])  # Пример
    odd_index_result = len([x for x in data['input_values'] if x % 2 != 0])  # Пример

    steps = {
        'alpha_section': f"Для вычисления α-сечения используем формулу: sum(values). Подставляем значения: sum({data['input_values']}) = {alpha_section_result}",
        'inclusion_degree': f"Степень включения рассчитывается как |Set1 ∩ Set2| / |Set1|. Подставляем: |{data['sets'][0]} ∩ {data['sets'][1]}| / |{data['sets'][0]}| = {inclusion_degree_result}",
        'odd_index': f"Индекс нечетности равен количеству нечётных чисел. Проверяем: {[x for x in data['input_values'] if x % 2 != 0]}, результат: {odd_index_result}",
    }

    result = {
        'alpha_section': alpha_section_result,
        'inclusion_degree': inclusion_degree_result,
        'odd_index': odd_index_result,
    }

    return Response({'result': result, 'steps': steps})


def calculate_alpha(values):
    """
    Пример функции для вычисления α-сечения.
    Реализуйте свою формулу, исходя из задачи.
    """
    return max(values)  # Пример: возвращаем максимальное значение как α-сечение.


def calculate_inclusion(sets):
    """
    Пример функции для вычисления степени включения.
    Реализуйте свою формулу, исходя из задачи.
    """
    set1, set2 = sets
    intersection = len(set(set1).intersection(set2))
    union = len(set(set1).union(set2))
    return intersection / union if union != 0 else 0  # Степень включения как отношение.


def calculate_odd_index(sets):
    """
    Пример функции для вычисления индекса нечетности.
    Реализуйте свою формулу, исходя из задачи.
    """
    all_elements = sets[0] + sets[1]
    odd_elements = [x for x in all_elements if x % 2 != 0]
    return len(odd_elements)  # Количество нечетных элементов.



# @api_view(['POST'])
# def calculate(request):
#     # Получение данных из запроса
#     data = request.data

#     # Проверка наличия ключей в запросе
#     if 'input_values' not in data or 'sets' not in data:
#         return Response({'error': 'Invalid input data'}, status=400)

#     try:
#         input_values = data['input_values']  # Список значений
#         sets = data['sets']  # Два множества в виде списка списков: [[set1], [set2]]

#         # Реализация расчетов
#         result = {
#             'alpha_section': calculate_alpha(input_values),
#             'inclusion_degree': calculate_inclusion(sets),
#             'odd_index': calculate_odd_index(sets),
#         }
#         return Response(result)

#     except Exception as e:
#         return Response({'error': str(e)}, status=400)