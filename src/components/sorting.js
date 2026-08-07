import {sortCollection, sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки
            action.dataset.value = sortMap[action.dataset.value]; // Меняем состояние по кругу через карту
            field = action.dataset.field;                         // Запоминаем, какое поле сортируем
            order = action.dataset.value;                         // Запоминаем направление

            // @todo: #3.2 — сбросить сортировки остальных колонок
            columns.forEach(column => {
                if (column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none'; // Сбрасываем все чужие кнопки в исходное состояние
                }
            });
        } else {
            // @todo: #3.3 — получить выбранный режим сортировки
            columns.forEach(column => {
                if (column.dataset.value !== 'none') { // Ищем активную колонку
                    field = column.dataset.field;      // Восстанавливаем поле
                    order = column.dataset.value;      // Восстанавливаем направление
                }
            });
        }

        return sortCollection(data, field, order);
    }
}