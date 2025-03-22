import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function VennDiagram({ result }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!result) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/venn.js@0.2.20/venn.min.js';
    script.async = true;
    script.onload = () => {
      const { originalSets, computed } = result;
      const sets = [];
      const setNames = originalSets.map((_, index) => `Set${index + 1}`);

      // Добавляем отдельные множества
      originalSets.forEach((set, index) => {
        const totalValue = Object.values(set).reduce((sum, val) => sum + val, 0) * 100;
        sets.push({
          sets: [setNames[index]],
          size: totalValue,
        });
      });

      // Функция для генерации всех возможных комбинаций подмножеств
      const getCombinations = (arr, minSize = 2) => {
        const results = [];
        const generate = (current, start) => {
          if (current.length >= minSize) results.push([...current]);
          for (let i = start; i < arr.length; i++) {
            current.push(arr[i]);
            generate(current, i + 1);
            current.pop();
          }
        };
        generate([], 0);
        return results;
      };

      // Генерируем все возможные комбинации множеств (парные, тройные и т.д.)
      const combinations = getCombinations(setNames, 2);
      combinations.forEach(combo => {
        const keysInAll = Object.keys(originalSets[0]).filter(key =>
          combo.every(setName => {
            const setIndex = setNames.indexOf(setName);
            return key in originalSets[setIndex];
          })
        );
        if (keysInAll.length > 0) {
          const intersectionValue = keysInAll.reduce((sum, key) => {
            const values = combo.map(setName => {
              const setIndex = setNames.indexOf(setName);
              return originalSets[setIndex][key];
            });
            return sum + Math.min(...values);
          }, 0) * 100;
          // Фильтруем пересечения с size > 10 для читаемости
          if (intersectionValue > 10) {
            sets.push({
              sets: combo,
              size: intersectionValue,
            });
          }
        }
      });

      // Создаем график
      const chart = window.venn.VennDiagram()
        .width(600)
        .height(400);

      const svg = d3.select(chartRef.current)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 600 400")
        .attr("preserveAspectRatio", "xMidYMid meet");

      const g = svg.append("g");
      g.datum(sets).call(chart);

      // Добавляем цвета для каждого множества
      const colors = ["#ff9999", "#99ccff", "#99ff99", "#ff99ff"];
      originalSets.forEach((_, index) => {
        d3.selectAll(`.venn-circle[venn-sets~="Set${index + 1}"] path`)
          .style("fill", colors[index])
          .style("fill-opacity", 0.6)
          .style("stroke", "#333")
          .style("stroke-width", 1);
      });

      // Настраиваем текст (подписи множеств)
      d3.selectAll(".venn-circle text")
        .style("fill", "black")
        .style("font-size", "14px")
        .style("font-weight", "bold");

      // Добавляем подписи и интерактивность для пересечений
      d3.selectAll(".venn-intersection path").each(function(d) {
        const intersection = d3.select(this);
        const setsInvolved = d.sets;
        const keysInIntersection = Object.keys(originalSets[0]).filter(key =>
          setsInvolved.every(setName => {
            const setIndex = setNames.indexOf(setName);
            return key in originalSets[setIndex];
          })
        );
        if (keysInIntersection.length > 0) {
          const value = keysInIntersection.reduce((sum, key) => {
            const values = setsInvolved.map(setName => {
              const setIndex = setNames.indexOf(setName);
              return originalSets[setIndex][key];
            });
            return sum + Math.min(...values);
          }, 0);
          const text = keysInIntersection.join(", ") + `: ${value.toFixed(2)}`;
          const bbox = this.getBBox();

          // Добавляем подпись для пересечения
          d3.select(this.parentNode)
            .append("text")
            .attr("x", bbox.x + bbox.width / 2)
            .attr("y", bbox.y + bbox.height / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "black")
            .text(text);

          // Добавляем интерактивность (подсказки и выделение)
          intersection
            .on("mouseover", function() {
              d3.select(this)
                .style("fill-opacity", 0.8)
                .style("stroke", "#000")
                .style("stroke-width", 2);
              // Показываем подсказку
              d3.select(chartRef.current)
                .append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background", "rgba(0, 0, 0, 0.8)")
                .style("color", "white")
                .style("padding", "5px")
                .style("border-radius", "5px")
                .style("pointer-events", "none")
                .style("left", `${d3.event.pageX + 10}px`)
                .style("top", `${d3.event.pageY - 10}px`)
                .text(`Пересечение: ${setsInvolved.join(" ∩ ")}\n${text}`);
            })
            .on("mousemove", function() {
              d3.select(".tooltip")
                .style("left", `${d3.event.pageX + 10}px`)
                .style("top", `${d3.event.pageY - 10}px`);
            })
            .on("mouseout", function() {
              d3.select(this)
                .style("fill-opacity", 0.6)
                .style("stroke", "#333")
                .style("stroke-width", 1);
              d3.select(".tooltip").remove();
            });
        }
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      d3.select(chartRef.current).selectAll("*").remove();
    };
  }, [result]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px', marginTop: '20px', position: 'relative' }} />;
}

export default VennDiagram;