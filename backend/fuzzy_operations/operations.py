def fuzzy_union(sets):
    result = {}
    elements = set().union(*[set(s.keys()) for s in sets])
    for elem in elements:
        result[elem] = max([s.get(elem, 0) for s in sets])
    return result

def fuzzy_intersection(sets):
    result = {}
    elements = set(sets[0].keys()).intersection(*[set(s.keys()) for s in sets[1:]])
    for elem in elements:
        result[elem] = min([s[elem] for s in sets])
    return result

def fuzzy_difference(sets):
    result = sets[0].copy()
    for s in sets[1:]:
        for elem in result:
            result[elem] = max(result[elem] - s.get(elem, 0), 0)
    return result

def fuzzy_complement(set_a):
    result = {}
    for elem in set_a:
        result[elem] = 1 - set_a[elem]
    return result

def fuzzy_concentration(set_a):
    result = {}
    for elem in set_a:
        result[elem] = set_a[elem] ** 2
    return result