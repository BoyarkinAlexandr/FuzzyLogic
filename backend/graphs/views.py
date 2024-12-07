import io
import networkx as nx
import matplotlib
matplotlib.use('Agg')  # Используем неинтерактивный бэкенд
import matplotlib.pyplot as plt
from django.http import JsonResponse, HttpResponse
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser


@api_view(['POST'])
def generate_transition_graph(request):
    try:
        # Разбираем входящие данные
        data = JSONParser().parse(request)
        transitions = data.get('transitions', {})

        # Создаем граф
        G = nx.DiGraph()  # Ориентированный граф
        for key, value in transitions.items():
            from_state, to_state = key.split('-')
            if value:  # Добавляем только существующие переходы
                G.add_edge(from_state, to_state, label=value)

        # Рисуем граф
        plt.figure(figsize=(10, 6))
        pos = nx.spring_layout(G)  # Позиционирование узлов
        nx.draw(G, pos, with_labels=True, node_color='lightblue', node_size=3000, font_size=12, font_weight='bold')
        edge_labels = nx.get_edge_attributes(G, 'label')
        nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_color='red')

        # Сохраняем граф в изображение
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        plt.close()

        return HttpResponse(buffer, content_type='image/png')

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
