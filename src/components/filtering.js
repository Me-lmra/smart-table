import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName])
                    .map(name => {
                        const option = document.createElement('option');
                        option.value = String(name);
                        option.textContent = String(name);
                        return option;
            })
        );
    });
    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const parent = action.parentElement; // Находим родительский контейнер кнопки
            const input = parent.querySelector('input'); // Ищем инпут рядом
            if (input) {
                input.value = ''; // Сбрасываем значение на экране
                state[action.dataset.field] = '';
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => {
            // 1. Твой код из чата: принудительно переводим копейки и суммы в числа для математического сравнения
            const rowValue = parseFloat(row.total);

            // Проверка диапазона "от" (totalFrom)
            if (state.totalFrom && state.totalFrom !== '') {
                const filterNum = parseFloat(state.totalFrom);
                if (rowValue < filterNum) return false; // Если сумма в таблице меньше минимальной — отсекаем
            }

            // Проверка диапазона "до" (totalTo)
            if (state.totalTo && state.totalTo !== '') {
                const filterNum = parseFloat(state.totalTo);
                if (rowValue > filterNum) return false; // Если сумма в таблице больше максимальной — отсекаем
            }

            // 2. И только если строка прошла диапазоны сумм, прогоняем её через стандартный компаратор Яндекса
            // В библиотеке Практикума компаратор вызывается вот так: compare(row, state)
            return compare(row, state);
        });
    }
}
