import numpy as np

def s_function(x, a, b):
    y = np.zeros_like(x)
    idx1 = (x > a) & (x <= (a + b) / 2)
    idx2 = (x > (a + b) / 2) & (x <= b)
    y[idx1] = 2 * ((x[idx1] - a) / (b - a)) ** 2
    y[idx2] = 1 - 2 * ((b - x[idx2]) / (b - a)) ** 2
    y[x > b] = 1
    return y

def z_function(x, a, b):
    y = np.zeros_like(x)
    idx1 = (x > a) & (x <= (a + b) / 2)
    idx2 = (x > (a + b) / 2) & (x <= b)
    y[idx1] = 1 - 2 * ((x[idx1] - a) / (b - a)) ** 2
    y[idx2] = 2 * ((b - x[idx2]) / (b - a)) ** 2
    return y

def triangle_function(x, a, b, c):
    y = np.zeros_like(x)
    idx1 = (x > a) & (x <= b)
    idx2 = (x > b) & (x <= c)
    y[idx1] = (x[idx1] - a) / (b - a)
    y[idx2] = (c - x[idx2]) / (c - b)
    return y

def trapezoidal_function(x, a, b, c, d):
    y = np.zeros_like(x)
    idx1 = (x > a) & (x <= b)
    idx2 = (x > b) & (x <= c)
    idx3 = (x > c) & (x <= d)
    y[idx1] = (x[idx1] - a) / (b - a)
    y[idx2] = 1
    y[idx3] = (d - x[idx3]) / (d - c)
    return y


# def t_function(x, a, b, c, d):
#     """
#     T-функция в виде симметричной трапеции, где:
#     - a, b, c, d - параметры, задающие границы.
#     """
#     y = np.zeros_like(x)
#     # Треугольная область от a до b
#     idx1 = (x > a) & (x <= b)
#     # Прямая область от b до c
#     idx2 = (x > b) & (x <= c)
#     # Треугольная область от c до d
#     idx3 = (x > c) & (x <= d)

#     # Вычисление для первой части (треугольник)
#     y[idx1] = (x[idx1] - a) / (b - a)
#     # Прямой участок
#     y[idx2] = 1
#     # Вычисление для второй части (треугольник)
#     y[idx3] = (d - x[idx3]) / (d - c)

#     return y