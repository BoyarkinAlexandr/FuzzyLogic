# membership/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import numpy as np
from .functions import s_function, z_function, triangle_function, trapezoidal_function



@csrf_exempt
def calculate_membership_function(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            function_type = data.get("function_type")
            params = data.get("params")
            min_x = data.get("min_x")
            max_x = data.get("max_x")
            num = data.get("num", 100)

            # Создаем массив x с заданным количеством точек
            x = np.linspace(min_x, max_x, num)

            # В зависимости от типа функции, вызываем соответствующую функцию
            if function_type == "S":
                a = params.get("a")
                b = params.get("b")
                y = s_function(x, a, b)
            elif function_type == "Z":
                a = params.get("a")
                b = params.get("b")
                y = z_function(x, a, b)
            elif function_type == "triangle":
                a = params.get("a")
                b = params.get("b")
                c = params.get("c")
                y = triangle_function(x, a, b, c)
            elif function_type == "trapezoidal":
                a = params.get("a")
                b = params.get("b")
                c = params.get("c")
                d = params.get("d")
                y = trapezoidal_function(x, a, b, c, d)
            elif function_type == "T":
                a = params.get("a")
                b = params.get("b")
                c = params.get("c")
                d = params.get("d")
                y = t_function(x, a, b, c, d)
            else:
                return JsonResponse({"error": "Invalid function type"}, status=400)

            # Возвращаем результат в виде JSON
            return JsonResponse({"x": x.tolist(), "y": y.tolist()})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)
