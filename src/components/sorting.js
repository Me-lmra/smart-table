import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки
            action.dataset.value = sortMap[action.dataset.value]; // меняем состояние по кругу через карту
            field = action.dataset.field; // запоминаем, какое поле сортируем
            order = action.dataset.value; // запоминаем направление

            // @todo: #3.2 — сбросить сортировки остальных колонок
            columns.forEach(column => {
                if (column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none'; // сбрасываем все чужие кнопки в исходное состояние
                }
            });
        } else {
            // @todo: #3.3 — получить выбранный режим сортировки
            columns.forEach(column => {
                if (column.dataset.value !== 'none') { // ищем активную колонку
                    field = column.dataset.field; // восстанавливаем поле
                    order = column.dataset.value; // восстанавливаем направление
                }
            });
        }

        const sort = (field && order !== 'none') ? `${field}:${order}` : null; // сохраним в переменную параметр сортировки в виде field:direction

        return sort ? Object.assign({}, query, { sort }) : query; // по общему принципу, если есть сортировка, добавляем, если нет, то не трогаем query
    }
}